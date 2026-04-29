import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { showDialog } from "../Dialog";
import { Clickable } from "../Clickable";
import { ScrollView } from "../ScrollView";
import { createStyle, DEFAULT_PRIMARY } from "./style";
import { loadAMap, type AMapNamespace } from "./loader";

// 选中地址的统一结构（对外回调）
export interface SelectedLocation {
  // POI 名称或逆地理结构化标题
  name: string;
  // 详细地址
  address: string;
  // 经度、纬度（GCJ02）
  longitude: number;
  latitude: number;
  // 城市名（来自逆地理或 POI）
  city?: string;
  // 省名
  province?: string;
  // 区/县
  district?: string;
  // 原始 POI（如果是从列表中选择）
  raw?: unknown;
}

export interface MapLocationSelectionProps {
  // 必填：高德 Web 端 Key
  amapKey: string;
  // 可选：高德安全密钥（生产建议使用代理 serviceHost）
  securityJsCode?: string;
  // 主题色，默认蓝色 #2f7dff
  primary?: string;
  // 初始中心点 [lng, lat]，缺省时使用 Geolocation 定位；再缺省时使用北京天安门
  initialCenter?: [number, number];
  // 初始城市名（用于 AutoComplete / PlaceSearch 限制）
  initialCity?: string;
  // 周边搜索半径（米），默认 1000
  searchRadius?: number;
  // 单页 POI 数量，默认 20，最大 50
  pageSize?: number;
  // 关闭（取消、确定后均会触发）
  onClose?: () => void;
  // 用户点击「确定」时回调；若未选择，将以当前地图中心 + 逆地理结果回调
  onSelect?: (loc: SelectedLocation) => void;
}

const DEFAULT_FALLBACK_CENTER: [number, number] = [116.397428, 39.90923]; // 北京

// 用户当前位置 marker 的全局 CSS（一次性注入到 document.head）
// 高德 Marker.content 被渲染到地图容器内，无法通过 emotion css prop 直接应用，
// 所以这里用一个全局 class 名 + 一次性注入的 <style> 实现样式与动画。
const USER_LOC_STYLE_ID = "mls-user-loc-style";
function ensureUserLocStyle() {
  if (typeof document === "undefined") return;
  if (document.getElementById(USER_LOC_STYLE_ID)) return;
  const styleEl = document.createElement("style");
  styleEl.id = USER_LOC_STYLE_ID;
  styleEl.textContent = `
.mls-user-loc {
  position: relative;
  width: 12px;
  height: 12px;
  pointer-events: none;
}
.mls-user-loc__dot {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 9px;
  height: 9px;
  margin-left: -4.5px;
  margin-top: -4.5px;
  border-radius: 50%;
  background-color: #4575F6;
  box-shadow: 0 0 0 1.5px #ffffff, 0 1px 2px rgba(0,0,0,0.25);
}
.mls-user-loc__ripple {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 9px;
  height: 9px;
  margin-left: -4.5px;
  margin-top: -4.5px;
  border-radius: 50%;
  background-color: #4575F6;
  opacity: 0.5;
  animation: mlsUserLocRipple 1.8s ease-out infinite;
}
@keyframes mlsUserLocRipple {
  0%   { transform: scale(1);   opacity: 0.5; }
  80%  { transform: scale(3.5); opacity: 0;   }
  100% { transform: scale(3.5); opacity: 0;   }
}
`;
  document.head.appendChild(styleEl);
}

interface POIItem {
  id: string;
  name: string;
  address: string;
  location: { lng: number; lat: number };
  cityname?: string;
  pname?: string;
  adname?: string;
  distance?: number;
  raw: any;
}

// 高德 PlaceSearch 在 keyword 为空时，必须依靠 type 才会返回附近 POI。
// 这里把所有大类编码全部打开，确保「楼宇 / 门牌地址 / 室内设施」也能被检索到，
// 否则附近列表会只到“小区”这一级，丢掉具体的楼栋。
//   010000 汽车服务            020000 汽车销售          030000 汽车维修
//   040000 摩托车服务          050000 餐饮服务          060000 购物服务
//   070000 生活服务            080000 体育休闲服务      090000 医疗保健服务
//   100000 住宿服务            110000 风景名胜          120000 商务住宅（含楼栋）
//   130000 政府机构及社会团体   140000 科教文化服务      150000 交通设施服务
//   160000 金融保险服务        170000 公司企业          180000 道路附属设施
//   190000 地名地址信息(旧)     200000 公共设施          220000 事件活动
//   970000 地名地址信息（含门牌号 / 楼栋 / 住宅楼名）
//   990000 室内设施
const NEARBY_POI_TYPE = [
  "010000",
  "020000",
  "030000",
  "040000",
  "050000",
  "060000",
  "070000",
  "080000",
  "090000",
  "100000",
  "110000",
  "120000",
  "130000",
  "140000",
  "150000",
  "160000",
  "170000",
  "180000",
  "190000",
  "200000",
  "220000",
  "970000",
  "990000",
].join("|");

// 把父 POI 与其 child_pois 展开成一个扁平数组（父在前，子按原顺序紧随其后）。
// 子 POI 通常缺少 distance / cityname，这里基于父 POI 兜底，让排序与展示一致。
function expandWithChildren(pois: any[]): any[] {
  const out: any[] = [];
  for (const p of pois) {
    if (!p) continue;
    out.push(p);
    const children: any[] = Array.isArray(p.child_pois) ? p.child_pois : [];
    for (const c of children) {
      if (!c || !c.location) continue;
      out.push({
        ...c,
        // child_pois 默认没有这些字段，从父 POI 继承一份
        cityname: c.cityname ?? p.cityname,
        pname: c.pname ?? p.pname,
        adname: c.adname ?? p.adname,
        distance:
          typeof c.distance === "number"
            ? c.distance
            : typeof p.distance === "number"
              ? p.distance
              : undefined,
        // 子 POI 的 address 经常为空，回退到父 POI 名称作为上下文
        address: c.address || p.name || p.address || "",
      });
    }
  }
  return out;
}

// 把高德 PlaceSearch / AutoComplete 返回的 poi 标准化
function normalizePOI(poi: any): POIItem | null {
  if (!poi || !poi.location) return null;
  const lng =
    typeof poi.location.getLng === "function"
      ? poi.location.getLng()
      : poi.location.lng;
  const lat =
    typeof poi.location.getLat === "function"
      ? poi.location.getLat()
      : poi.location.lat;
  if (typeof lng !== "number" || typeof lat !== "number") return null;
  return {
    id: poi.id ?? `${lng},${lat},${poi.name ?? ""}`,
    name: poi.name ?? "",
    address: poi.address ?? "",
    location: { lng, lat },
    cityname: poi.cityname,
    pname: poi.pname,
    adname: poi.adname,
    distance: typeof poi.distance === "number" ? poi.distance : undefined,
    raw: poi,
  };
}

export function MapLocationSelection(props: MapLocationSelectionProps) {
  const {
    amapKey,
    securityJsCode,
    primary = DEFAULT_PRIMARY,
    initialCenter,
    initialCity,
    searchRadius = 1000,
    pageSize = 20,
    onClose,
    onSelect,
  } = props;

  const style = useMemo(() => createStyle(primary), [primary]);
  const safePageSize = Math.min(50, Math.max(1, pageSize));

  // ===== 状态 =====
  const [poiList, setPoiList] = useState<POIItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");
  const [composing, setComposing] = useState(false);
  const [tips, setTips] = useState<POIItem[] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  // “定位中”：加载地图 SDK 或调用 Geolocation 期间展示遵蒙，阻断交互
  const [locating, setLocating] = useState(true);
  // 地图中心 pin 动画状态：'idle' | 'lifted' | 'drop'
  const [pinPhase, setPinPhase] = useState<"idle" | "lifted" | "drop">("idle");
  const dropTimerRef = useRef<number | null>(null);

  // ===== refs =====
  const mapElRef = useRef<HTMLDivElement>(null);
  const AMapRef = useRef<AMapNamespace | null>(null);
  const mapRef = useRef<any>(null);
  const placeSearchRef = useRef<any>(null);
  const autoCompleteRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  // 标记“当前的 setCenter 是程序触发”，避免 moveend 形成回环
  const programmaticMoveRef = useRef(false);
  // 用于忽略过期的搜索请求结果
  const searchSeqRef = useRef(0);
  const tipSeqRef = useRef(0);
  // 最新的中心点（用于「确定」兜底）
  const centerRef = useRef<[number, number]>(
    initialCenter ?? DEFAULT_FALLBACK_CENTER,
  );
  // 选中条目，最新值
  const selectedItemRef = useRef<POIItem | null>(null);
  // 翻页：当前 page、当前正在查询的 page、当前中心
  const pageIndexRef = useRef(1);
  const searchCenterRef = useRef<[number, number] | null>(null);
  const loadingMoreRef = useRef(false);
  // 错误提示的最新值（避免 setState 闭包过期）
  const errorMsgRef = useRef<string | null>(null);
  errorMsgRef.current = errorMsg;
  // 手指/鼠标是否正在地图上（pointerdown 后、pointerup 前）
  const interactingRef = useRef(false);
  // 地图是否正在运动（movestart 后、moveend 前）
  const mapMovingRef = useRef(false);
  // pin 动画状态的最新值，以供事件回调读取
  const pinPhaseRef = useRef<"idle" | "lifted" | "drop">("idle");
  pinPhaseRef.current = pinPhase;
  // 拆除绑在 mapEl 上的 pointer 事件监听
  const cleanupPointerRef = useRef<(() => void) | null>(null);

  // ===== 周边搜索（支持翻页） =====
  // append=false 表示新一轮搜索（重置页码 + 替换列表 + 默认选中第一项）
  // append=true  表示翻页加载（追加到列表尾）
  const searchAround = useCallback(
    (lng: number, lat: number, append: boolean = false) => {
      const AMap = AMapRef.current;
      const ps = placeSearchRef.current;
      if (!AMap || !ps) return;

      if (!append) {
        // 新一轮：重置页码与中心；递增 seq 让正在飞的旧请求作废
        pageIndexRef.current = 1;
        searchCenterRef.current = [lng, lat];
        searchSeqRef.current++;
      }
      const seq = searchSeqRef.current;

      const targetPage = append ? pageIndexRef.current + 1 : 1;
      // tip 搜索可能将 type 设为 ""，这里必须复位为附近 POI 类型
      if (typeof ps.setType === "function") {
        ps.setType(NEARBY_POI_TYPE);
      }
      ps.setPageIndex(targetPage);
      ps.setPageSize(safePageSize);

      if (append) loadingMoreRef.current = true;

      ps.searchNearBy(
        "",
        new AMap.LngLat(lng, lat),
        searchRadius,
        (status: string, result: any) => {
          if (seq !== searchSeqRef.current) {
            // 过期请求：append 也要释放锁，避免后续翻页被永久阻塞
            if (append) loadingMoreRef.current = false;
            return;
          }
          if (append) loadingMoreRef.current = false;

          const pois: any[] = result?.poiList?.pois ?? [];
          // 把每个父 POI 自身 + 它的 child_pois（楼栋 / 出入口 / 商铺等）展开为同级条目，
          // 让用户可以直接选到「XX 小区 3 号楼」这种粒度。
          const list = expandWithChildren(pois)
            .map(normalizePOI)
            .filter((x): x is POIItem => !!x);
          // 距离从近到远
          list.sort(
            (a, b) =>
              (a.distance ?? Number.POSITIVE_INFINITY) -
              (b.distance ?? Number.POSITIVE_INFINITY),
          );

          // 高德 PlaceSearch 返回的 count 是当前查询条件下的总数
          const totalCount: number =
            (result?.poiList?.count as number | undefined) ??
            (status === "complete" ? list.length : 0);

          if (status !== "complete" || list.length === 0) {
            if (!append) {
              // 诊断与提示：status='error' 大多是安全密钥未配置或服务报错
              const info: string =
                (result && (result.info as string)) ||
                (status as string) ||
                "";
              if (status === "error") {
                console.warn(
                  "[MapLocationSelection] PlaceSearch 失败\u3002常见原因：" +
                    "未配置 securityJsCode（JSAPI v2.0 必填） / Key 未开通服务 / 超出限额。info=",
                  info,
                );
                setErrorMsg(
                  "地点服务不可用\uFF1A请在 showMapLocationSelection 中传入正确的 securityJsCode",
                );
              }
              setPoiList([]);
              setSelectedId(null);
              selectedItemRef.current = null;
              setHasMore(false);
            } else {
              // 翻页失败 / 无更多，停止加载
              setHasMore(false);
            }
            return;
          }
          // 成功任何一页后清除之前的错误提示
          if (errorMsgRef.current) setErrorMsg(null);

          if (append) {
            pageIndexRef.current = targetPage;
            setPoiList((prev) => {
              const existed = new Set(prev.map((p) => p.id));
              const merged = [...prev];
              for (const item of list) {
                if (!existed.has(item.id)) merged.push(item);
              }
              setHasMore(merged.length < totalCount);
              return merged;
            });
          } else {
            pageIndexRef.current = 1;
            setPoiList(list);
            setHasMore(list.length < totalCount);
            const first = list[0];
            setSelectedId(first.id);
            selectedItemRef.current = first;
          }
        },
      );
    },
    [safePageSize, searchRadius],
  );

  // 翻页（onReachBottom）
  const handleReachBottom = useCallback(() => {
    if (loadingMoreRef.current) return;
    if (!hasMore) return;
    if (tips !== null) return; // 搜索提示模式不支持翻页
    const center = searchCenterRef.current;
    if (!center) return;
    searchAround(center[0], center[1], true);
  }, [hasMore, searchAround, tips]);

  // ===== 程序化定位到某个坐标（屏蔽 moveend 自动搜索回环） =====
  const moveTo = useCallback(
    (lng: number, lat: number, zoom?: number) => {
      const map = mapRef.current;
      if (!map) return;
      programmaticMoveRef.current = true;
      centerRef.current = [lng, lat];
      if (typeof zoom === "number") {
        map.setZoomAndCenter(zoom, [lng, lat]);
      } else {
        map.setCenter([lng, lat]);
      }
      // 主动触发一次新搜索（因为 moveend 自动搜索被屏蔽）
      searchAround(lng, lat, false);
    },
    [searchAround],
  );

  // ===== 绘制用户当前位置（蓝色圆 + 永不停止的涟漪），随地图移动 =====
  const drawUserLocation = useCallback((lng: number, lat: number) => {
    const AMap = AMapRef.current;
    const map = mapRef.current;
    if (!AMap || !map) return;
    ensureUserLocStyle();
    if (!userMarkerRef.current) {
      // 用 DOM 自定义内容：内圆 + 一层永不停止的涟漪环
      const content = document.createElement("div");
      content.className = "mls-user-loc";
      content.innerHTML =
        '<span class="mls-user-loc__ripple"></span>' +
        '<span class="mls-user-loc__dot"></span>';
      userMarkerRef.current = new AMap.Marker({
        position: [lng, lat],
        content,
        // 让 content 中心对齐定位点
        offset: new AMap.Pixel(-6, -6),
        anchor: "center",
        zIndex: 90,
        clickable: false,
        bubble: true,
      });
      userMarkerRef.current.setMap(map);
    } else {
      userMarkerRef.current.setPosition([lng, lat]);
    }
  }, []);

  // ===== 进行一次精准定位（用 locating 状态显示内嵌 loading 遮罩） =====
  // 返回 Promise<[lng, lat] | null>
  const runGeolocate = useCallback((): Promise<[number, number] | null> => {
    const AMap = AMapRef.current;
    if (!AMap) return Promise.resolve(null);
    setLocating(true);
    return new Promise<[number, number] | null>((resolve) => {
      const geo = new AMap.Geolocation({
        // 关键：高精度 + 强制 GCJ02 转换 + 禁用 IP 兜底（IP 定位粒度极差）
        enableHighAccuracy: true,
        timeout: 10000,
        convert: true,
        noIpLocate: 1,
        // 关闭高德自带 UI，由组件接管
        showButton: false,
        showMarker: false,
        showCircle: false,
        panToLocation: false,
        zoomToAccuracy: false,
      });
      geo.getCurrentPosition((status: string, result: any) => {
        if (status === "complete" && result?.position) {
          const lng = result.position.getLng();
          const lat = result.position.getLat();
          resolve([lng, lat]);
        } else {
          console.warn(
            "[MapLocationSelection] Geolocation 失败，请确认 https/localhost 环境与授权。status=",
            status,
            "result=",
            result,
          );
          resolve(null);
        }
      });
    }).finally(() => {
      setLocating(false);
    });
  }, []);

  // ===== 初始化地图 =====
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const AMap = await loadAMap({
          key: amapKey,
          securityJsCode,
          plugins: [
            "AMap.Geocoder",
            "AMap.AutoComplete",
            "AMap.PlaceSearch",
            "AMap.Geolocation",
          ],
        });
        if (cancelled || !mapElRef.current) return;
        AMapRef.current = AMap;

        const startCenter = initialCenter ?? DEFAULT_FALLBACK_CENTER;
        centerRef.current = startCenter;

        const map = new AMap.Map(mapElRef.current, {
          viewMode: "2D",
          zoom: 16,
          center: startCenter,
          showLabel: true,
        });
        mapRef.current = map;

        placeSearchRef.current = new AMap.PlaceSearch({
          pageSize: safePageSize,
          pageIndex: 1,
          // extensions=all 才会返回 child_pois（楼栋等子 POI），
          // 否则即便 type 命中“商务住宅”也只到小区粒度。
          extensions: "all",
          type: NEARBY_POI_TYPE,
          city: initialCity ?? "全国",
        });
        autoCompleteRef.current = new AMap.AutoComplete({
          city: initialCity ?? "全国",
          citylimit: false,
        });
        geocoderRef.current = new AMap.Geocoder({});

        // 触发一次"落下 + 弹跳"动画（共用方法）
        const triggerDrop = () => {
          setPinPhase("drop");
          if (dropTimerRef.current) {
            window.clearTimeout(dropTimerRef.current);
          }
          dropTimerRef.current = window.setTimeout(() => {
            setPinPhase("idle");
            dropTimerRef.current = null;
          }, 750);
        };

        // 地图开始移动 → 抬起中心图钉
        map.on("movestart", () => {
          mapMovingRef.current = true;
          if (dropTimerRef.current) {
            window.clearTimeout(dropTimerRef.current);
            dropTimerRef.current = null;
          }
          setPinPhase("lifted");
        });

        // 地图移动结束 → 更新中心点
        // 注意：手指仍按在地图上时（user 未抬起），不触发搜索、不触发落下动画
        map.on("moveend", () => {
          mapMovingRef.current = false;
          const c = map.getCenter();
          centerRef.current = [c.getLng(), c.getLat()];

          if (programmaticMoveRef.current) {
            // 程序化平移：触发一次落下动画，但不再发起搜索
            programmaticMoveRef.current = false;
            triggerDrop();
            return;
          }
          if (interactingRef.current) {
            // 用户手指仍按在地图上：保持抬起，等到 pointerup 再处理
            return;
          }
          // 用户已离开地图（含惯性结束的 moveend）：落下 + 搜索
          triggerDrop();
          searchAround(c.getLng(), c.getLat(), false);
        });

        // 地图点击 → 移动中心到点击位置
        map.on("click", (e: any) => {
          const lng = e.lnglat.getLng();
          const lat = e.lnglat.getLat();
          moveTo(lng, lat);
        });

        // 接管手势：手指按下/离开地图时控制 pin 的抬起与落下
        const mapEl = mapElRef.current;
        const onPointerDown = () => {
          interactingRef.current = true;
          if (dropTimerRef.current) {
            window.clearTimeout(dropTimerRef.current);
            dropTimerRef.current = null;
          }
        };
        const onPointerUp = () => {
          if (!interactingRef.current) return;
          interactingRef.current = false;
          // 若此时地图已停止（用户拖动后停顿再松手），手动触发落下 + 搜索
          if (!mapMovingRef.current && pinPhaseRef.current === "lifted") {
            const [lng, lat] = centerRef.current;
            triggerDrop();
            searchAround(lng, lat, false);
          }
          // 否则仍在惯性运动中，等 moveend 来处理
        };
        mapEl?.addEventListener("pointerdown", onPointerDown);
        mapEl?.addEventListener("pointerup", onPointerUp);
        mapEl?.addEventListener("pointercancel", onPointerUp);
        // 保存清理函数
        cleanupPointerRef.current = () => {
          mapEl?.removeEventListener("pointerdown", onPointerDown);
          mapEl?.removeEventListener("pointerup", onPointerUp);
          mapEl?.removeEventListener("pointercancel", onPointerUp);
        };

        // 立刻基于初始中心做一次搜索，保证列表非空
        searchAround(startCenter[0], startCenter[1], false);

        // 若未提供 initialCenter，进行一次精准定位（带 showLoading）
        if (!initialCenter) {
          const pos = await runGeolocate();
          if (cancelled) return;
          if (pos) {
            drawUserLocation(pos[0], pos[1]);
            moveTo(pos[0], pos[1], 16);
          }
        }
      } catch (err: any) {
        if (cancelled) return;
        setErrorMsg(err?.message || "地图加载失败");
      }
    })();

    return () => {
      cancelled = true;
      if (dropTimerRef.current) {
        window.clearTimeout(dropTimerRef.current);
        dropTimerRef.current = null;
      }
      if (cleanupPointerRef.current) {
        cleanupPointerRef.current();
        cleanupPointerRef.current = null;
      }
      try {
        if (mapRef.current) {
          mapRef.current.destroy();
        }
      } catch {
        // ignore
      }
      mapRef.current = null;
      AMapRef.current = null;
      placeSearchRef.current = null;
      autoCompleteRef.current = null;
      geocoderRef.current = null;
      userMarkerRef.current = null;
    };
    // 仅初始化一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== 「回到当前位置」按钮 =====
  const handleLocate = useCallback(async () => {
    const pos = await runGeolocate();
    if (!pos) return;
    drawUserLocation(pos[0], pos[1]);
    moveTo(pos[0], pos[1], 16);
  }, [drawUserLocation, moveTo, runGeolocate]);

  // ===== 输入提示：以当前地图中心为基点的周边关键字检索 =====
  // AutoComplete 只能按城市检索，会出现“在上海输入幼儿园却匹配到吉林”这种问题。
  // 这里改用 PlaceSearch.searchNearBy(keyword, center, radius)，返回的是当前地图中心附近的匹配 POI。
  useEffect(() => {
    if (composing) return;
    const kw = keyword.trim();
    if (!kw) {
      setTips(null);
      return;
    }
    const AMap = AMapRef.current;
    const ps = placeSearchRef.current;
    if (!AMap || !ps) return;
    const seq = ++tipSeqRef.current;
    const [lng, lat] = centerRef.current;
    // 临时调整为全类型检索（keyword 非空时 type 限制会过于严苛）
    if (typeof ps.setType === "function") {
      ps.setType("");
    }
    ps.setPageIndex(1);
    ps.setPageSize(safePageSize);
    // 周边检索半径适当放大，覆盖整个城市部分区域
    const tipRadius = Math.max(searchRadius, 50000);
    ps.searchNearBy(
      kw,
      new AMap.LngLat(lng, lat),
      tipRadius,
      (status: string, result: any) => {
        if (seq !== tipSeqRef.current) return;
        if (status !== "complete" || !result?.poiList?.pois) {
          setTips([]);
          return;
        }
        const list = expandWithChildren(result.poiList.pois as any[])
          .map(normalizePOI)
          .filter((x): x is POIItem => !!x)
          .sort(
            (a, b) =>
              (a.distance ?? Number.POSITIVE_INFINITY) -
              (b.distance ?? Number.POSITIVE_INFINITY),
          );
        setTips(list);
      },
    );
  }, [keyword, composing, safePageSize, searchRadius]);

  // ===== 选择列表项 =====
  const handlePickItem = useCallback(
    (item: POIItem) => {
      setSelectedId(item.id);
      selectedItemRef.current = item;
      moveTo(item.location.lng, item.location.lat);
      if (tips !== null) {
        setKeyword("");
        setTips(null);
      }
    },
    [moveTo, tips],
  );

  // ===== 「确定」按钮 =====
  const handleConfirm = useCallback(() => {
    const sel = selectedItemRef.current;
    if (sel) {
      onSelect?.({
        name: sel.name,
        address: sel.address,
        longitude: sel.location.lng,
        latitude: sel.location.lat,
        city: sel.cityname,
        province: sel.pname,
        district: sel.adname,
        raw: sel.raw,
      });
      onClose?.();
      return;
    }
    const [lng, lat] = centerRef.current;
    const geocoder = geocoderRef.current;
    if (!geocoder) {
      onSelect?.({ name: "", address: "", longitude: lng, latitude: lat });
      onClose?.();
      return;
    }
    geocoder.getAddress([lng, lat], (status: string, result: any) => {
      if (status === "complete" && result?.regeocode) {
        const r = result.regeocode;
        onSelect?.({
          name: r.formattedAddress ?? "",
          address: r.formattedAddress ?? "",
          longitude: lng,
          latitude: lat,
          city: r.addressComponent?.city || r.addressComponent?.province,
          province: r.addressComponent?.province,
          district: r.addressComponent?.district,
        });
      } else {
        onSelect?.({ name: "", address: "", longitude: lng, latitude: lat });
      }
      onClose?.();
    });
  }, [onSelect, onClose]);

  // ===== 列表渲染 =====
  const list = tips ?? poiList;
  const isTipsMode = tips !== null;

  const renderListContent = () => {
    if (errorMsg) return <div css={style.empty}>{errorMsg}</div>;
    if (list.length === 0) {
      return <div css={style.empty}>暂无附近地点</div>;
    }
    return (
      <>
        {list.map((item) => {
          const active = selectedId === item.id;
          return (
            <Clickable
              key={item.id}
              css={style.item}
              onClick={() => handlePickItem(item)}
            >
              <div css={style.itemBody}>
                <div css={[style.itemTitle, active && style.itemTitleActive]}>
                  {item.name || "未命名地点"}
                </div>
                {item.address && (
                  <div css={style.itemDesc}>
                    {typeof item.distance === "number"
                      ? `${
                          item.distance < 1000
                            ? `${Math.round(item.distance)}m`
                            : `${(item.distance / 1000).toFixed(1)}km`
                        } | `
                      : ""}
                    {item.address}
                  </div>
                )}
              </div>
              {active && (
                <svg viewBox="0 0 1024 1024" css={style.itemCheck}>
                  <path d="M433.5 696.6l-176-176c-12.5-12.5-12.5-32.8 0-45.3 12.5-12.5 32.8-12.5 45.3 0L456.1 628.7l278.2-278.2c12.5-12.5 32.8-12.5 45.3 0 12.5 12.5 12.5 32.8 0 45.3l-301 300.8c-12.5 12.5-32.8 12.5-45.1 0z" />
                </svg>
              )}
            </Clickable>
          );
        })}
        {!isTipsMode && !hasMore && list.length > 0 && (
          <div css={style.listEnd}>没有更多了</div>
        )}
      </>
    );
  };

  return (
    <div css={style.inner}>
      {/* 顶部地图 */}
      <div css={style.mapWrap}>
        <div ref={mapElRef} css={style.mapContainer} />

        {/* 始终居中、定位完成时会有一次抬起→落下的弹跳动画的 pin */}
        <svg
          viewBox="0 0 1024 1024"
          // pinPhase 变化时以 key 重新跳动以重新跳动动画
          key={pinPhase}
          css={[
            style.centerPin,
            pinPhase === "lifted" && style.centerPinLifted,
            pinPhase === "drop" && style.centerPinDrop,
          ]}
        >
          <path
            d="M486.4 593.92v353.28c0 15.36 10.24 30.72 25.6 30.72s25.6-15.36 25.6-30.72v-353.28h-51.2z"
            fill="#5D5D5D"
          />
          <path
            d="M512 0c168.96 0 307.2 138.24 307.2 307.2s-138.24 307.2-307.2 307.2-307.2-138.24-307.2-307.2 138.24-307.2 307.2-307.2zM450.56 194.56C409.6 215.04 389.12 261.12 389.12 307.2c0 71.68 56.32 128 128 128S645.12 378.88 645.12 307.2c0-46.08-25.6-87.04-61.44-112.64-46.08-20.48-97.28-20.48-133.12 0z"
            fill={primary}
          />
          <path
            d="M322.56 972.8c0 30.72 87.04 51.2 194.56 51.2 107.52 0 194.56-25.6 194.56-51.2s-87.04-51.2-194.56-51.2c-107.52-5.12-194.56 20.48-194.56 51.2z"
            fill="#5D5D5D"
            opacity=".2"
          />
        </svg>

        {/* 顶部一行：取消（左） / 确定（右） */}
        <div css={style.topBar}>
          <Clickable css={style.cancelBtn} onClick={() => onClose?.()}>
            取消
          </Clickable>
          <Clickable css={style.confirmBtn} onClick={handleConfirm}>
            确定
          </Clickable>
        </div>

        {/* 右下角：回到当前位置（远离高德版权区域） */}
        <Clickable css={style.locateBtn} onClick={handleLocate}>
          <svg viewBox="0 0 1024 1024" css={style.locateBtnIcon}>
            <path d="M511.963002 316.994807c-107.263506 0-195.034191 87.767686-195.034191 195.034191 0 107.270505 87.770686 195.039191 195.034191 195.039191 107.270505 0 195.039191-87.767686 195.039191-195.039191 0-107.265505-87.769686-195.034191-195.039191-195.034191z m416.563779 148.490009C907.584049 272.331511 751.662489 116.414951 558.514184 95.474219V0.062996H465.42182V95.474219C272.270515 116.416951 116.352955 272.333511 95.412223 465.485816H0v93.084364h95.412223c20.940732 193.152305 176.860292 349.069865 370.009597 370.017597v95.412223h93.092364v-95.412223C751.660489 907.645045 907.584049 751.723485 928.526781 558.56918H1023.938004v-93.084364h-95.411223zM511.963002 853.345333c-187.718634 0-341.311335-153.589701-341.311334-341.316335 0-187.718634 153.5927-341.311335 341.311334-341.311334 187.725634 0 341.316334 153.5927 341.316335 341.311334 0 187.725634-153.5927 341.316334-341.316335 341.316335z" />
          </svg>
        </Clickable>

        {/* 定位中：spinner + 小号文字 */}
        {locating && (
          <div css={style.locatingMask}>
            <span css={style.spinner} />
            <span>定位中</span>
          </div>
        )}
      </div>
      <div css={[style.bottom, style.bottomRelative]}>
        <div css={[style.searchBox, locating && style.searchDisabled]}>
          <div css={style.searchInner}>
            <svg viewBox="0 0 1024 1024" css={style.searchIcon}>
              <path d="M896 870.4l-128-128c55.467-68.267 89.6-149.333 89.6-238.933 0-98.134-38.4-192-110.933-264.534-149.334-149.333-384-149.333-533.334-4.266-145.066 145.066-145.066 384 0 529.066 72.534 72.534 166.4 110.934 264.534 110.934 89.6 0 174.933-29.867 238.933-89.6l128 128c4.267 4.266 12.8 8.533 21.333 8.533s17.067-4.267 21.334-8.533c17.066-8.534 17.066-29.867 8.533-42.667zM260.267 721.067c-119.467-123.734-119.467-320 0-439.467 59.733-59.733 140.8-89.6 217.6-89.6 81.066 0 157.866 29.867 217.6 89.6 59.733 59.733 89.6 136.533 89.6 217.6 0 81.067-34.134 162.133-89.6 217.6-55.467 59.733-132.267 93.867-217.6 93.867-81.067 0-157.867-34.134-217.6-89.6z" />
            </svg>
            <input
              css={style.searchInput}
              placeholder={locating ? "定位中，请稍候" : "搜索地点"}
              value={keyword}
              disabled={locating}
              onChange={(e) => setKeyword(e.target.value)}
              onCompositionStart={() => setComposing(true)}
              onCompositionEnd={(e) => {
                setComposing(false);
                setKeyword(e.currentTarget.value);
              }}
            />
            {keyword && !locating && (
              <span
                css={style.searchClear}
                onClick={() => {
                  setKeyword("");
                  setTips(null);
                }}
              >
                <svg viewBox="0 0 1024 1024" css={style.searchClearIcon}>
                  <path d="M520.533333 464.008533l-155.409066-155.477333c-18.8416-18.773333-42.427733-14.1312-56.558934 0-18.8416 18.8416-14.097067 42.427733 0 56.558933l150.766934 150.7328-155.511467 155.4432c-18.8416 18.8416-14.097067 42.427733 0 56.558934 18.875733 18.773333 42.461867 14.097067 56.593067 0l150.7328-150.766934 150.698666 150.766934c18.8416 18.773333 42.427733 14.097067 56.5248 0 18.875733-18.875733 14.1312-42.461867 0-56.558934l-150.7328-150.766933 150.7328-150.698667c18.875733-18.8416 14.1312-42.427733 0-56.5248-18.8416-18.875733-42.427733-14.1312-56.5248 0l-146.0224 146.0224 4.7104 4.7104z m353.28 409.838934c-202.513067 202.513067-527.598933 197.8368-725.435733 0-197.870933-197.870933-197.802667-527.598933 0-725.469867 197.7344-197.8368 527.5648-197.8368 725.435733 0 197.8368 197.870933 202.513067 522.9568 0 725.469867z" />
                </svg>
              </span>
            )}
          </div>
        </div>

        <div css={style.listArea}>
          <ScrollView
            height="100%"
            onReachBottom={handleReachBottom}
            reachBottomThreshold={80}
            // 搜索提示模式 / 错误 / 空 / 已加载完毕：不展示底部 loading
            showLoading={!isTipsMode && !errorMsg && hasMore && list.length > 0}
          >
            {renderListContent()}
          </ScrollView>
        </div>
        {/* 定位中：盖在底部搜索 + 列表上，阻断所有交互（地址列表会在定位完成后整体刷新） */}
        {locating && <div css={style.bottomLockedMask} />}
      </div>
    </div>
  );
}

export function showMapLocationSelection(props: MapLocationSelectionProps) {
  let closing = false;
  let close: (() => Promise<void>) | undefined;
  const requestClose = () => {
    if (closing) return;
    closing = true;
    close?.();
  };

  const userOnClose = props.onClose;
  close = showDialog({
    type: "pullLeft",
    showMask: false,
    boxStyle: { left: 0, width: "100%" },
    content: (
      <MapLocationSelection
        {...props}
        onClose={() => {
          userOnClose?.();
          requestClose();
        }}
      />
    ),
  });
}
