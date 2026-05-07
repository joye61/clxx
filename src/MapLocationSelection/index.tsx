import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { showDialog } from "../Dialog";
import { Clickable } from "../Clickable";
import { ScrollView, type ScrollViewHandle } from "../ScrollView";
import { createStyle, DEFAULT_PRIMARY } from "./style";
import { haversineMeters, type POIItem, type SelectedLocation } from "./types";
import type { MapProvider } from "./provider";
import type { ReverseGeocodeResult } from "./provider";
import {
  createProvider,
  type CreateProviderOptions,
} from "./createProvider";
import { buildSelectedLocation } from "./buildSelectedLocation";

export type { SelectedLocation } from "./types";
export { getLocation, type GetLocationOptions } from "./getLocation";

// provider / amapKey / securityJsCode / bmapAk 字段全部由 CreateProviderOptions
// 提供（与独立函数 getLocation 共享同一组配置 + 校验逻辑），UI 专属字段在
// 这里继续追加。
export interface MapLocationSelectionProps extends CreateProviderOptions {
  // 主题色，默认蓝色 #2f7dff
  primary?: string;
  // 初始中心点 [lng, lat]，缺省时使用 provider 自身定位；再缺省时使用各自坐标系下的北京
  // 注意：amap 期望 GCJ02、bmap 期望 BD09
  initialCenter?: [number, number];
  // 初始城市名（amap 用于 PlaceSearch 限制；bmap 暂未使用，预留）
  initialCity?: string;
  // 周边搜索半径（米），默认 200。
  //
  // 打车 / 网约车「上车点」选择场景下，用户拖动 centerPin 选定上车位置，
  // 列表只需展示 centerPin 周围最近的 POI（楼栋 / 出入口 / 路边商铺等）即可。
  // 200m 是市区高密度区域 + 郊区低密度的平衡值——市区内 200m 已能拉到 30+
  // 候选 POI，取距离最近的 20 条；郊区也能保证至少有几个候选。
  // 业务有更大范围检索需要可显式传入更大值（≤ 高德 50000、≤ 百度 1000）。
  searchRadius?: number;
  // 单页 POI 数量，默认 20，最大 50
  pageSize?: number;
  // 是否允许「IP 定位兜底」。默认 false。
  //
  // 浏览器 H5 定位（GPS / WiFi）失败 / 拒绝时，高德 / 百度 SDK 内部都会
  // **自动 fallback** 到 IP 定位（城市级精度，accuracy 通常 ≥ 5000m）。
  //
  // - **false（默认）**：组件检测到 IP 兜底结果时丢弃，「自动定位」与「回到
  //   当前位置」按钮的体验等价于"H5 失败 = 定位失败"。适合打车 / 外卖等
  //   "必须拿到精确位置"的业务，避免把 5km 误差塞给业务方；
  // - **true**：接受 IP 兜底（用户拒绝 GPS 时仍能拿到城市级位置），适合
  //   "有大致位置就行"的城市级业务（门店推荐、广告投放等）。
  allowIpFallback?: boolean;
  // 关闭（取消、确定后均会触发）
  onClose?: () => void;
  // 用户点击「确定」时回调，参数 = 列表当前选中项（默认是列表第一项）
  onSelect?: (loc: SelectedLocation) => void;
}

// 周边搜索结果排序：距离从近到远（distance 缺失时排到最后）。
function sortByDistance(items: POIItem[]): POIItem[] {
  return [...items].sort(
    (a, b) =>
      (a.distance ?? Number.POSITIVE_INFINITY) -
      (b.distance ?? Number.POSITIVE_INFINITY),
  );
}

// 关键字搜索结果排序：「名称命中度分级 + 同档距离升序」。
//
// 为什么 keyword 模式不能用 sortByDistance：
//   * 高德 SDK 对"虹桥火车站"会拆 token 做模糊匹配，"浦东虹桥花园"等仅含"虹桥"
//     的近距离 POI 会大量挤入 4-9km 这一档，把真实"虹桥火车站"（28km 外的精确
//     命中）一路压到很后面，用户在首屏完全看不到想搜的目标。
//   * 百度数据库里站点出入口/商铺等以独立 POI 注册，按距离排虽然能进列表但顺序
//     混乱（"上海近虹桥火车站民宿"5km 在前、"虹桥火车站东出口"17.8km 在后），
//     用户得自行甄别。
//   * 跨城市搜索（在上海搜"天安门"）时，本地若有任何"天安门XX 分店"等同名子串
//     POI，单纯按距离排会把它顶到首位，把 1075km 外**真正的**北京天安门挤到末尾。
//     微信"发送位置"的体感是远端唯一精确命中应该出现在顶部——靠 tier 0（精确等于）
//     兜住这个语义。
//
// 命中等级：
//   tier 0：name 完全等于 keyword（"天安门"=="天安门"、"虹桥火车站"=="虹桥火车站"）。
//          即使 1000km 外也强制顶到列表首位——这是"用户搜的就是这个"的最强信号。
//   tier 1：name 含完整 keyword 且非 tier 0（"天安门广场"、"虹桥火车站东出口"、
//          "上海虹桥火车站民宿"等）。同档按距离升序，本地命中天然在远端命中之上。
//   tier 2：name 不含但 address 含完整 keyword（街道地址里出现关键字的）。
//   tier 3：其余仅 SDK 拆 token 命中的模糊匹配（"浦东虹桥花园"等）。
function sortByKeywordRelevance(
  items: POIItem[],
  keyword: string,
): POIItem[] {
  const kw = keyword.trim();
  if (!kw) return sortByDistance(items);
  const tier = (item: POIItem): number => {
    const name = item.name ?? "";
    if (name === kw) return 0;
    if (name.includes(kw)) return 1;
    if ((item.address ?? "").includes(kw)) return 2;
    return 3;
  };
  return [...items].sort((a, b) => {
    const ta = tier(a);
    const tb = tier(b);
    if (ta !== tb) return ta - tb;
    return (
      (a.distance ?? Number.POSITIVE_INFINITY) -
      (b.distance ?? Number.POSITIVE_INFINITY)
    );
  });
}

// 把 POI 列表的 distance 字段重写成「POI ↔ 地图中心 (centerPin)」。
//
// 打车 / 网约车「上车点」选择场景的关键不变量：用户拖到哪儿，列表就展示
// "离那里最近的 POI"，distance 直接告诉用户「我刚好选在这家酒店门口 5m」。
// 跟"POI ↔ 我当前位置"完全不同——后者在用户拖图选别处上车点（如帮家人接机时
// 选远处机场出口）时数值动辄上千米，毫无意义。
//
// 高德 / 百度 SDK 自带的 distance 字段口径不一（searchNearBy 给的是
// "POI ↔ 搜索中心"，但 child_pois 展开后会丢失），统一在 UI 层用 haversine
// 重算，保证排序口径绝对一致。
function rewriteDistanceFromCenter(
  items: POIItem[],
  center: [number, number],
): POIItem[] {
  return items.map((item) => ({
    ...item,
    distance: haversineMeters(
      center[0],
      center[1],
      item.location.lng,
      item.location.lat,
    ),
  }));
}

// 列表头部「当前位置」虚拟项的固定 id。
//
// 与真实 POI 的 id 解耦：真实 POI id 来自 SDK（高德 amap_poi_xxx、百度 b0_xxx
// 等格式），不会撞这个保留前缀，可放心做 === 比对。用途：
//   * list 渲染：识别"这条是当前位置项"→ 强制 active=true；
//   * handlePickItem：识别"用户点了当前位置项"→ no-op（已经选中，无需操作）；
//   * onSelect 路径不需要识别它——handleConfirm 走 centerRef + reverseCache，
//     从不读列表项 id，CURRENT_LOCATION_ID 永远不会进入回调输出。
const CURRENT_LOCATION_ID = "__current_location__";

export function MapLocationSelection(props: MapLocationSelectionProps) {
  const {
    primary = DEFAULT_PRIMARY,
    initialCenter,
    initialCity,
    searchRadius = 200,
    pageSize = 20,
    allowIpFallback = false,
    onClose,
    onSelect,
  } = props;

  const style = useMemo(() => createStyle(primary), [primary]);
  const safePageSize = Math.min(50, Math.max(1, pageSize));

  // ===== 状态 =====
  // 周边 POI 列表：以地图当前中心为基准、按距离从近到远的精确 POI（楼宇 / 酒店 /
  // 学校 / 小区楼栋 等大类全开，详见 provider.amap.ts NEARBY_POI_TYPE）。
  // 拖图 / 点图 / 回到当前位置 / 列表翻页都通过 commitMapCenter / searchAroundMore
  // 维护这一份。**搜索框为空时**列表展示的就是它。
  const [poiList, setPoiList] = useState<POIItem[]>([]);
  // 用户在列表里点选的项 id；**只在用户主动点击时才有值**——拖图后默认 null
  // （列表全部不勾选），避免"系统默认选中 list[0]"被误以为是用户选择，从而把
  // 离 centerPin 几米~几十米的 POI 当成上车点。仅作为列表行高亮的视觉反馈，
  // 不参与「确定」回调（那一步永远以 centerRef + reverseGeocode 为真值）。
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  // 搜索关键字：清空时 tips 也回到 null，列表自动 fallback 到 poiList（centerPin 周边）。
  const [keyword, setKeyword] = useState("");
  // 中文 / 韩文 / 日文输入法 composing 状态：composition 期间不发起搜索，
  // 避免每次按键都打一次接口（也避免拼音/候选词阶段的"半字符"被当成关键字）。
  const [composing, setComposing] = useState(false);
  // 搜索结果列表。
  //   - null：当前是"周边模式"，UI 渲染 poiList；
  //   - []  ：搜索完成但 0 命中（"未找到相关地点"提示）；
  //   - [..]：搜索命中，UI 渲染搜索结果。
  // 需要把"周边模式"和"搜索模式"严格区分，因为：1) 翻页只在周边模式生效；
  // 2) 选中项点击后搜索模式要清搜索框、周边模式要保持列表稳定。
  const [tips, setTips] = useState<POIItem[] | null>(null);
  // "定位中"：加载地图 SDK 或首次定位期间展示遮罩，阻断交互
  // （仅在地图尚未就绪 / 首次定位拿到结果之前出现；点击 locateBtn 重定位不再走这套）
  const [locating, setLocating] = useState(true);
  // 「回到当前位置」按钮自身的轻量 loading：仅按钮显示 spinner，地图与列表保持可交互
  const [btnLocating, setBtnLocating] = useState(false);
  // 列表加载中：commitMapCenter 拉周边 / keyword effect 拉搜索结果**进入飞行中**时
  // 为 true，结果回写完成切回 false。**仅控制列表区半透明遮罩**，不阻断搜索框输入
  // （keyword 搜索期间用户可继续编辑关键字，新一次 effect 会接管 loading）。
  // 翻页（searchAroundMore）不动这个状态——翻页用 ScrollView 自身底部 spinner。
  const [listLoading, setListLoading] = useState(false);
  // 地图中心 pin 动画状态：'idle' | 'lifted' | 'drop'
  const [pinPhase, setPinPhase] = useState<"idle" | "lifted" | "drop">("idle");
  const dropTimerRef = useRef<number | null>(null);
  // 「列表头部当前位置项」重算触发器。
  //
  // 当前位置项的数据源（centerRef / commitSeqRef / reverseCacheRef）都是 ref，
  // ref 变化不会触发 React 重渲染——bumpCurrentItem 推这个 state 让派生的
  // currentItem useMemo 重算。poiList（用于 nearestPoi 兜底）本身是 state，
  // 自动触发依赖它的 useMemo，不需要 bump。
  //
  // 触发时机：commitMapCenter 入口（centerRef 变更）+ commitMapCenter 内
  // rgPromise.then（reverseCacheRef 写入）。其他路径（拖图触发的 moveend、
  // 程序化定位 moveTo 等）最终都会走到 commitMapCenter，无需单独 bump。
  const [currentItemVersion, setCurrentItemVersion] = useState(0);
  const bumpCurrentItem = useCallback(() => {
    setCurrentItemVersion((v) => v + 1);
  }, []);

  // 用户真实 GPS 定位坐标（[lng, lat]），仅在两个时机更新：
  //   1) 组件初始化时的自动 geolocate 成功；
  //   2) 用户点"回到当前位置"按钮 handleLocate 成功。
  // 用途：列表项的距离展示（"距离我多远"），以及当前位置项的 distance
  // （centerPin ↔ 用户真实位置）。
  // 为什么是 state 不是 ref：列表渲染需要这个值参与 displayDistance 计算，
  // ref 变化不会触发重渲染；state 在用户回到当前位置后能立即让所有距离值刷新。
  // null 表示 GPS 不可用 / 被拒 / 未授权——此时 displayDistance 退化到
  // item.distance（即 POI ↔ centerPin），保持原行为。
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );

  // ===== refs =====
  const mapElRef = useRef<HTMLDivElement>(null);
  // 列表 ScrollView 命令式句柄：每次列表"全量刷新"（commit / 搜索）后调
  // scrollToTop 把滚动位置回到顶部，与微信 / 高德 App 拉新列表时的体感对齐。
  // 翻页（searchAroundMore）追加场景**不**调，避免把用户拉到顶。
  const scrollViewRef = useRef<ScrollViewHandle>(null);
  // provider 是稳定引用：在 useEffect 内一次性创建并 init，组件卸载时销毁
  const providerRef = useRef<MapProvider | null>(null);
  // 标记"当前的 setCenter 是程序触发"，避免 moveend 形成回环（程序化移动期间
  // moveend 来临时不再二次 commitMapCenter）。
  const programmaticMoveRef = useRef(false);
  // 最新的中心点（用于「确定」回调输出 / 翻页起算坐标）。
  // 打车场景核心契约：经纬度永远来自这个 ref（centerPin 真值，100% 精准），
  // **不**从列表挑 POI——POI 与 centerPin 天然有几米~几十米误差不能用作真值。
  const centerRef = useRef<[number, number] | null>(initialCenter ?? null);
  // centerPin 当前坐标对应的逆地理结果缓存。**严格只存 provider.reverseGeocode
  // 的官方反查结果**——保证 province/city/district + 详细 address 都齐全。
  // commitMapCenter 后台触发 reverseGeocode 写入这里；handleConfirm 命中 cache 时
  // 即可省掉一次网络请求。
  // seq 用 commitSeqRef.current 同步：旧 seq 的回调到达时会被丢弃，避免读到过期数据。
  const reverseCacheRef = useRef<
    | (ReverseGeocodeResult & { seq: number })
    | null
  >(null);
  // commitMapCenter / handlePickItem 中 reverseGeocode 的「在飞 promise」。
  // handleConfirm 缓存未命中时优先 await 这条 promise（已发起的，等它回来即可），
  // 避免在原已发起的请求外重复多发一次。
  const reversePendingRef = useRef<{
    seq: number;
    promise: Promise<ReverseGeocodeResult | null>;
  } | null>(null);
  // 用户**主动**点过的列表项（不是默认勾选）。仅用于「确定」回调的 name 优先级——
  // POI 的 name 通常是"楼栋 / 商铺 / 出入口"级别，比反查 API 的 "街道+门牌"
  // 更精准、对司机更友好。但 POI 经常缺 province/city/district，所以
  // address / 行政区划仍以 reverseCacheRef 的官方反查结果为准。
  // seq 跟 commitSeqRef.current 同步——拖图后 seq 推进，老 POI 选择失效。
  const pickedPoiRef = useRef<{
    seq: number;
    name: string;
    address: string;
  } | null>(null);
  // poiList 的 ref 镜像：handleConfirm 在「地图选址、未点列表」时要从最近 POI
  // 取 name/address 兜底（解决 reverseGeocode fallback 到"陆家嘴街道""高桥镇"等
  // 粗粒度 township 的体验问题），但 useCallback 不想把 poiList state 加到依赖
  // 里（避免每次列表更新都重建 handleConfirm）。用 ref 镜像保证读到最新值且
  // 闭包稳定。
  const poiListRef = useRef<POIItem[]>([]);
  // 翻页：当前 page、当前正在查询的 page、当前中心、加载锁
  const pageIndexRef = useRef(1);
  const searchCenterRef = useRef<[number, number] | null>(null);
  const loadingMoreRef = useRef(false);
  // 错误提示的最新值（避免 setState 闭包过期）
  const errorMsgRef = useRef<string | null>(null);
  errorMsgRef.current = errorMsg;
  // 「地图中心已变」的最新回调引用，让一次性注册的 map 事件闭包能调到最新状态
  const commitMapCenterRef = useRef<(lng: number, lat: number) => void>(
    () => {},
  );
  // 手指/鼠标是否正在地图上（pointerdown 后、pointerup 前）
  const interactingRef = useRef(false);
  // 地图是否正在运动（movestart 后、moveend 前）
  const mapMovingRef = useRef(false);
  // pin 动画状态的最新值，以供事件回调读取
  const pinPhaseRef = useRef<"idle" | "lifted" | "drop">("idle");
  pinPhaseRef.current = pinPhase;
  // poiList ref 镜像：每次渲染同步一次，保证 handleConfirm 能读到最新列表。
  // 配合上方 poiListRef 的声明使用。直接用赋值而非 useEffect——render 期赋值
  // ref 在 React 里是被允许的（且立即生效，无需等 commit 阶段）。
  poiListRef.current = poiList;
  // 拆除绑在 mapEl 上的 pointer 事件监听
  const cleanupPointerRef = useRef<(() => void) | null>(null);
  // commitMapCenter 抢占 seq：拖图 / 点击 / 回到当前位置连续触发时，旧的 fetchAround
  // 回调抵达后若不是最新一次直接丢弃，避免老结果回来覆盖新中心的 poiList。
  const commitSeqRef = useRef(0);
  // handleConfirm 的互斥锁：用户在 reverseGeocode 网络等待中再次点击确定时，
  // 防止 onSelect 被多次回调（业务侧重复处理订单）。一次进入即"成立"，不解锁——
  // onClose 后组件销毁，互斥锁随组件 unmount 一起被回收。
  const confirmingRef = useRef(false);
  // 关键字搜索的抢占 seq。useEffect 中 debounce 后发起的请求若回来时 seq 已过期
  // （用户继续输入 / 清空了搜索框）直接丢弃。与 provider 内部的 keywordSeq 配合
  // 形成双层保护：组件层管 UI 应不应该接收，provider 层管 SDK 回调应不应该 resolve。
  const keywordSeqRef = useRef(0);

  // ===== 周边搜索：纯数据获取（不写 setState）=====
  // 把 provider.searchAround 的结果做距离改写 + 排序，返回标准化 list。
  // 距离口径与排序（打车上车点场景的核心不变量）：
  //   1) 把 distance 改写成「POI ↔ 地图中心 (centerPin)」——告诉用户
  //      "我刚好选在这家酒店门口 5m"，与微信 / 滴滴 / 高德打车上车点选择器一致；
  //   2) 再按这个 distance 升序排，让 list[0] 永远 = 离 centerPin 最近的 POI——
  //      这就是用户最可能要选的"上车点 POI"。
  // 高德 child_pois 展开后顺序乱、百度 surroundingPois 原顺序也未必按距离，
  // 统一在 UI 层兜一道排序保证口径绝对一致。
  type FetchAroundResult =
    | { ok: true; list: POIItem[]; hasMore: boolean }
    | { ok: false; error: string };
  const fetchAround = useCallback(
    async (
      lng: number,
      lat: number,
      page: number,
    ): Promise<FetchAroundResult | null> => {
      const provider = providerRef.current;
      if (!provider) return null;
      let result;
      try {
        result = await provider.searchAround([lng, lat], {
          page,
          pageSize: safePageSize,
          radius: searchRadius,
        });
      } catch (err: any) {
        console.warn("[MapLocationSelection] searchAround 失败：", err);
        return { ok: false, error: err?.message || "地点服务不可用" };
      }
      const rewritten = rewriteDistanceFromCenter(result.pois, [lng, lat]);
      const list = sortByDistance(rewritten);
      return { ok: true, list, hasMore: result.hasMore };
    },
    [safePageSize, searchRadius],
  );

  // ===== 周边搜索：翻页（追加到 poiList 尾）=====
  // 仅 onReachBottom 调用。本轮 page+1，原列表保留并 append。
  // 翻页**不重置 selectedId**——用户在新追加的项里看到更远的目标时仍可保留之前的选择。
  const searchAroundMore = useCallback(async () => {
    const center = searchCenterRef.current;
    if (!center) return;
    if (!hasMore) return; // provider 已表态后续无更多
    const targetPage = pageIndexRef.current + 1;
    loadingMoreRef.current = true;
    const res = await fetchAround(center[0], center[1], targetPage);
    loadingMoreRef.current = false;
    if (!res || !res.ok) return;
    if (res.list.length === 0) {
      setHasMore(false);
      return;
    }
    pageIndexRef.current = targetPage;
    setPoiList((prev) => {
      const existed = new Set(prev.map((p) => p.id));
      const merged = [...prev];
      for (const item of res.list) {
        if (!existed.has(item.id)) merged.push(item);
      }
      return merged;
    });
    setHasMore(res.hasMore);
  }, [fetchAround, hasMore]);

  // 翻页（onReachBottom）
  // 搜索模式（tips !== null）禁用翻页：provider.searchByKeyword 不返回分页元数据，
  // 翻页接口语义不一致，强行翻页会拿到错乱顺序的结果。
  const handleReachBottom = useCallback(() => {
    if (loadingMoreRef.current) return;
    if (!hasMore) return;
    if (tips !== null) return;
    searchAroundMore();
  }, [hasMore, searchAroundMore, tips]);

  // ===== 「地图中心已变」的统一回调 =====
  // 任何让中心发生变化的入口（拖图静止后、点击地图、回到当前位置、init）都收敛到这里：
  //   1. 推进 commitSeqRef 抢占式 seq；
  //   2. **并发**触发两件事：
  //      a) fetchAround 拉新一轮周边 POI（page=1）—— 给列表渲染用；
  //      b) provider.reverseGeocode 反查 centerPin 真实地名 —— 给「确定」回调兜底。
  //         这个反查与列表的 POI 完全独立——列表只是辅助参考，最终回调用的地名以
  //         centerPin 经纬度逆地理为准（打车场景的"100% 精准"契约）。
  //   3. 拿到新 list 后 setPoiList，**清空 selectedId**——列表项默认不勾选，
  //      list[0] 与 centerPin 之间天然有 5~80m 误差，默认勾选会让用户误以为
  //      "选了这个 POI"导致司机被导航到错误位置。仅当用户主动点列表项时才有 selectedId。
  //   4. reverseGeocode 回来后写入 reverseCacheRef，handleConfirm 优先读它。
  // 抢占式 seq：连续触发只保留最后一次的结果，避免「拖到 A → 拖到 B → A 的回调
  // 才回来覆盖 B 的列表 / 缓存」的竞态。
  const commitMapCenter = useCallback(
    async (lng: number, lat: number) => {
      const provider = providerRef.current;
      if (!provider) return;
      const seq = ++commitSeqRef.current;
      centerRef.current = [lng, lat];
      pageIndexRef.current = 1;
      searchCenterRef.current = [lng, lat];

      // 触发列表头部当前位置项重算：center / commitSeqRef 已新——旧 reverseCache
      // 因 seq 不匹配会被识别为 stale，currentItem useMemo 立刻给到「占位形态」
      // （仅有经纬度兜底）；rgPromise 回来后再 bump 一次覆写真值。
      bumpCurrentItem();

      // **进入加载态**：列表区半透明遮罩 + spinner 即刻显示。
      //
      // 抢占式 seq 下的 loading 复位策略：
      //   - 早退分支（seq 已被新 seq 覆盖）**不复位** loading，因为新 seq 进入时
      //     已经又 setListLoading(true) 了一次，最终最后一次成功的会复位；
      //   - 当前 seq 走完正常 setPoiList 分支后才 setListLoading(false)；
      //   - fetchAround 内部已 try/catch 异常并返回 { ok: false }，外层不会抛——
      //     所以 loading 一定会到一次复位（不会卡死）。
      setListLoading(true);

      // 后台并发发起反向地理编码，把 promise 存起来供 handleConfirm 复用。
      // .catch 收住异常避免「未处理的 rejection」warning（reverseGeocode 失败时返回 null）。
      const rgPromise = provider.reverseGeocode([lng, lat]).catch(() => null);
      reversePendingRef.current = { seq, promise: rgPromise };
      rgPromise.then((rg) => {
        if (seq !== commitSeqRef.current) return; // 已被新 seq 作废
        if (!rg) return;
        reverseCacheRef.current = { ...rg, seq };
        // 反查回来后再 bump：currentItem useMemo 用真值（含真实地名 / 详细
        // address）覆写之前的占位形态。
        bumpCurrentItem();
      });

      const aroundRes = await fetchAround(lng, lat, 1);
      if (seq !== commitSeqRef.current) return;

      // **不默认勾选 list[0]**：list[0] 是"离 centerPin 最近的 POI"，但**不等于**centerPin
      // 真值——通常有 5~80m 误差。打车场景下默认勾选会让用户误以为"选了这个 POI"，
      // 导致司机被导航到 POI 而非用户实际拖动到的精准位置。
      // 用户主动点击列表项时才设置 selectedId（见 handlePickItem），那一刻才是
      // "用户主动认领某个 POI 当作上车点"的真实信号。
      if (aroundRes && aroundRes.ok) {
        setPoiList(aroundRes.list);
        setHasMore(aroundRes.hasMore);
        setSelectedId(null);
        if (errorMsgRef.current) setErrorMsg(null);
      } else {
        setPoiList([]);
        setHasMore(false);
        setSelectedId(null);
        if (aroundRes && !aroundRes.ok) {
          setErrorMsg(aroundRes.error);
        }
      }
      setListLoading(false);
      // 列表全量刷新后回到顶部：与微信 / 高德 App 拉新列表的体感对齐。
      // requestAnimationFrame 确保在 React commit 之后执行——这一帧 ScrollView
      // 的 DOM 已经渲染了新内容，scrollTop=0 恰好让用户看到 list[0]。
      requestAnimationFrame(() => scrollViewRef.current?.scrollToTop());
    },
    [fetchAround, bumpCurrentItem],
  );
  commitMapCenterRef.current = commitMapCenter;

  // ===== 程序化定位到某个坐标（屏蔽 moveend 自动搜索回环）=====
  // 仅 handleLocate / init 用——把 centerPin 飞到目标点，然后主动调一次
  // commitMapCenter 刷新列表，并通过 programmaticMoveRef 让 moveend 不重复跑一遍。
  const moveTo = useCallback(
    (lng: number, lat: number, zoom?: number) => {
      const provider = providerRef.current;
      if (!provider) return;
      programmaticMoveRef.current = true;
      provider.setCenter([lng, lat], zoom);
      commitMapCenter(lng, lat);
    },
    [commitMapCenter],
  );

  // ===== 地图视角飞行：仅同步地图中心，**不刷新列表 / 不重置 selectedId** =====
  // 专给 handlePickItem 用：用户在列表里点选某 POI 后，让地图飞过去给视觉确认，
  // 但列表内容、当前选中态都保持稳定。programmaticMoveRef 让 moveend 来临时
  // 直接 return，不触发 commitMapCenter——避免"飞过去 → 拉新列表 → selectedId 被
  // 重置回 list[0] → 用户的选择丢失"的回环（这是旧版闪烁问题的根因）。
  //
  // 注意 setCenter 不传 zoom：保留用户当前的缩放层级，避免视觉跳变。
  //
  // **同步推进 commitSeqRef**：作废任何进行中的 reverseGeocode 异步回调
  //（例如旧位置的反查回来时不再写入缓存），保证 reverseCacheRef 跟最新 centerRef 一致。
  const flyMapTo = useCallback((lng: number, lat: number) => {
    const provider = providerRef.current;
    if (!provider) return;
    programmaticMoveRef.current = true;
    provider.setCenter([lng, lat]);
    centerRef.current = [lng, lat];
    commitSeqRef.current += 1;
    reversePendingRef.current = null;
  }, []);

  // ===== 「回到当前位置」按钮 =====
  // 用 silent 定位 + 按钮自身 spinner，避免每次都掀起整屏遮罩 → 体感更快、地图与列表保持可交互。
  // 连续点击由 provider.geolocate 内部去抖（共享 in-flight Promise），不会触发多次 GPS。
  const handleLocate = useCallback(async () => {
    if (btnLocating) return;
    const provider = providerRef.current;
    if (!provider) return;
    setBtnLocating(true);
    try {
      const pos = await provider.geolocate({ allowIpFallback });
      if (!pos) return;
      provider.upsertUserMarker(pos);
      // 更新真实 GPS 坐标 → 让列表所有项 + 当前位置项的距离展示按"距离我"刷新。
      // 此时 centerPin 也会通过 moveTo → commitMapCenter 同步到 pos，所以
      // 当前位置项的距离会变为 0m（真正"重合时为 0"）。
      setUserLocation(pos);
      moveTo(pos[0], pos[1], 16);
    } finally {
      setBtnLocating(false);
    }
  }, [btnLocating, moveTo, allowIpFallback]);

  // ===== 初始化地图（仅一次）=====
  useEffect(() => {
    let cancelled = false;
    let provider: MapProvider | null = null;
    (async () => {
      try {
        provider = createProvider(props);
        providerRef.current = provider;
        if (!mapElRef.current) return;
        await provider.init({
          container: mapElRef.current,
          initialCenter,
          initialZoom: 16,
          initialCity,
          primary,
        });
        if (cancelled) return;

        // 同步 centerRef：以 provider 的实际中心为准（fallback 等情况由 provider 决定）
        const c0 = provider.getCenter();
        centerRef.current = c0;

        // 触发一次"落下 + 弹跳"动画（时长 = drop keyframes 0.5s + 缓冲）
        const triggerDrop = () => {
          setPinPhase("drop");
          if (dropTimerRef.current) {
            window.clearTimeout(dropTimerRef.current);
          }
          dropTimerRef.current = window.setTimeout(() => {
            setPinPhase("idle");
            dropTimerRef.current = null;
          }, 540);
        };

        // 地图开始移动 → 抬起中心图钉
        provider.on("movestart", () => {
          mapMovingRef.current = true;
          if (dropTimerRef.current) {
            window.clearTimeout(dropTimerRef.current);
            dropTimerRef.current = null;
          }
          setPinPhase("lifted");
        });

        // 地图移动结束 → 更新中心点 + 刷新周边 POI
        // 注意：手指仍按在地图上时（user 未抬起），不触发搜索、不触发落下动画
        provider.on("moveend", () => {
          mapMovingRef.current = false;
          if (!providerRef.current) return;
          const c = providerRef.current.getCenter();
          centerRef.current = c;

          if (programmaticMoveRef.current) {
            programmaticMoveRef.current = false;
            triggerDrop();
            return;
          }
          if (interactingRef.current) {
            // 用户手指仍按在地图上：保持抬起，等到 pointerup 再处理
            return;
          }
          triggerDrop();
          commitMapCenterRef.current(c[0], c[1]);
        });

        // 地图点击：跟拖图同语义——把中心切到点击点，列表重新以新中心为基础刷新。
        // 不通过 moveTo（避免 init 一次性闭包持有旧引用），直接走 commitMapCenterRef 转发。
        provider.on("click", (lng: number, lat: number) => {
          programmaticMoveRef.current = true;
          providerRef.current?.setCenter([lng, lat]);
          commitMapCenterRef.current(lng, lat);
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
          // 若此时地图已停止（用户拖动后停顿再松手），手动触发落下 + 同步列表
          if (!mapMovingRef.current && pinPhaseRef.current === "lifted") {
            const center = centerRef.current;
            if (center) {
              triggerDrop();
              commitMapCenterRef.current(center[0], center[1]);
            }
          }
          // 否则仍在惯性运动中，等 moveend 来处理
        };
        mapEl?.addEventListener("pointerdown", onPointerDown);
        mapEl?.addEventListener("pointerup", onPointerUp);
        mapEl?.addEventListener("pointercancel", onPointerUp);
        cleanupPointerRef.current = () => {
          mapEl?.removeEventListener("pointerdown", onPointerDown);
          mapEl?.removeEventListener("pointerup", onPointerUp);
          mapEl?.removeEventListener("pointercancel", onPointerUp);
        };

        // 首次 commit 策略（v2，修复"百度首次进入列表跑到 1000+ km 之外"）：
        //
        // 老方案：无脑先用 c0（initialCenter 或 provider 内置 fallback = 北京）
        // commit 一次，再 await geolocate → setCenter → commit 一次。问题在于：
        //   - 用户没传 initialCenter 时 c0 = 北京 fallback，第一次 fan-out 立刻
        //     用北京中心拉周边；
        //   - 如果 geolocate 失败 / 被拒 / 极慢（典型场景：移动端无 HTTPS、用户拒绝
        //     授权、移动数据定位 5-10s 才回），第二次 commit 不发生或迟到——
        //     用户视觉上看到列表是北京 POI（与实际位置可能 1000+ km 之差）；
        //   - 即便 geolocate 成功，那 5-10s 中间态也会先闪出错误 POI 列表。
        //
        // 新方案：
        //   * 提供了 initialCenter：c0 就是用户期望的中心，立刻 commit；
        //   * 没提供 initialCenter：**不立刻 commit fallback**，而是先 await
        //     geolocate 拿真值再 commit；geolocate 失败才用 fallback 兜底 commit。
        //     locating 遮罩本来就盖到 setLocating(false) 之前，列表区被挡住，
        //     用户视觉上不会看到"先北京后上海"的中间错误态。
        //
        // 这条策略下，初次进入百度地图（无 initialCenter）的体验是：
        //   遮罩盖住 → geolocate (1-3s) → setCenter 到真实位置 → commit 一次 → 关遮罩
        //   全过程只有一次 fan-out，列表初始即为正确中心的周边。
        if (initialCenter) {
          commitMapCenterRef.current(c0[0], c0[1]);
          setLocating(false);
        } else {
          const pos = await providerRef.current?.geolocate({
            allowIpFallback,
          });
          if (cancelled) return;
          if (pos) {
            providerRef.current?.upsertUserMarker(pos);
            // 记下真实 GPS 坐标——列表项的距离展示口径需要它（POI ↔ 用户真实位置）。
            // 此时 centerPin 也会被 setCenter 到 pos，所以当前位置项 distance = 0。
            setUserLocation(pos);
            programmaticMoveRef.current = true;
            providerRef.current?.setCenter(pos, 16);
            commitMapCenterRef.current(pos[0], pos[1]);
          } else {
            // geolocate 失败 / 被拒：用 c0（fallback 中心）兜底 commit 一次，
            // 让组件至少能渲染出列表与 reverseGeocode 结果，业务方拿到的是
            // fallback 经纬度——比"列表永远空 + 确定按钮无效"体验好。
            commitMapCenterRef.current(c0[0], c0[1]);
          }
          if (cancelled) return;
          setLocating(false);
        }
      } catch (err: any) {
        if (cancelled) return;
        console.warn("[MapLocationSelection] init 失败：", err);
        setErrorMsg(err?.message || "地图加载失败");
        setLocating(false);
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
        provider?.destroy();
      } catch {
        // ignore
      }
      providerRef.current = null;
    };
    // 仅初始化一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== 关键字搜索（debounced）=====
  // 用户在搜索框输入：以 centerRef 为参考点调 provider.searchByKeyword，
  // 返回的 POI 经过距离重写 + **名称命中度优先排序**后写入 tips。
  //
  // 距离与排序口径（与 nearby 列表故意不同）：
  //   * 距离统一改写成「POI ↔ centerPin」（与 nearby 列表一致），让搜索结果里
  //     "30m 海底捞"和"180m 海底捞"的相对距离对用户更直观；
  //   * 排序用 sortByKeywordRelevance（名称包含完整 keyword 优先 + 同档距离升序）
  //     而非纯 sortByDistance——纯距离排会让"虹桥火车站"等远距离精确命中被
  //     "浦东虹桥花园"等近距离 token 模糊命中挤出首屏，用户感觉"列表里没有
  //     想搜的"。详见 sortByKeywordRelevance 头部注释。
  //
  // 防抖：250ms。每次按键产生新 seq，旧请求回来时 seq 不匹配直接丢弃；
  // 清空 keyword（trim 后为空）会立刻把 tips 设回 null，无需等防抖到时。
  // composing 期间（中文 / 日文输入法候选阶段）跳过，避免拼音字符被当成关键字。
  useEffect(() => {
    if (composing) return;
    const kw = keyword.trim();
    if (!kw) {
      // keyword 清空回到周边模式：tips 设 null 让 UI 立即切回 poiList（中间无
      // 中间态闪烁）；listLoading 也复位——keyword 清空不需要 loading 反馈。
      keywordSeqRef.current += 1;
      setTips(null);
      setListLoading(false);
      return;
    }
    const provider = providerRef.current;
    const center = centerRef.current;
    if (!provider || !center) return;
    const seq = ++keywordSeqRef.current;
    const timer = window.setTimeout(async () => {
      // **进入加载态**：在防抖到时**之后**才 set loading，避免每打一个字都闪
      // 一次 spinner（用户拼字阶段不应有 loading 反馈）。
      setListLoading(true);
      let list: POIItem[] = [];
      try {
        list = await provider.searchByKeyword(center, kw, {
          page: 1,
          pageSize: safePageSize,
          radius: searchRadius,
        });
      } catch (err) {
        console.warn("[MapLocationSelection] searchByKeyword 失败：", err);
        list = [];
      }
      if (seq !== keywordSeqRef.current) return;
      const baseCenter = centerRef.current ?? center;
      const rewritten = rewriteDistanceFromCenter(list, baseCenter);
      setTips(sortByKeywordRelevance(rewritten, kw));
      setListLoading(false);
      // 搜索结果刷新后回到顶部：与周边模式刷新口径对齐。
      requestAnimationFrame(() => scrollViewRef.current?.scrollToTop());
    }, 250);
    return () => {
      window.clearTimeout(timer);
    };
  }, [keyword, composing, safePageSize, searchRadius]);

  // ===== 选择列表项（双向联动）=====
  //
  // 两种模式行为不同（**用户需求显式约定**）：
  //
  // 1) 周边模式（tips === null）——保留 selectedId 视觉态、不刷新列表
  //    * 切换选中态（selectedId）：UI 视觉反馈，标记"用户主动认领了这条 POI"；
  //    * flyMapTo：地图 centerPin 飞到该 POI 上（"用户选哪个，地图就指哪个"），
  //      但**不**调 commitMapCenter——列表保持稳定，避免"点 A → 飞过去 →
  //      moveend → 拉新列表 → selectedId 被重置"的回环；
  //    * 写 pickedPoiRef：作为 handleConfirm 的 name 优先级来源（POI 名通常是
  //      楼栋/商铺级，比反查的"街道+门牌"对司机更友好）；
  //    * 后台 reverseGeocode：flyMapTo 已推进 commitSeqRef，老反查作废；
  //      这里发起新一次反查，让 handleConfirm 能拿到该 POI 经纬度对应的
  //      官方省市区 / 详细 address。
  //
  // 2) 搜索模式（tips !== null）——清搜索 + 刷新到周边列表
  //    * 用 moveTo（= setCenter + commitMapCenter）：centerPin 飞到 POI、列表
  //      重新拉成"以新中心为基准的周边列表"；
  //    * setKeyword("") + setTips(null)：搜索 effect 清理（keywordSeqRef 抢占
  //      作废任何在飞的搜索请求），UI 回到周边模式；
  //    * **不主动 setSelectedId**：commitMapCenter 会把 selectedId 清掉
  //      （周边列表初始无选中态，符合"默认地址列表没有选中"的需求）。被点的 POI
  //      此时已是 centerPin，会出现在新周边列表的最前面；
  //    * 仍写 pickedPoiRef（用 moveTo 后最新的 seq）：让 handleConfirm 可优先
  //      使用 POI 名（"海底捞 浦东店"等楼栋/商铺级），比反查的"中山路 100 号"
  //      对司机更友好。
  const handlePickItem = useCallback(
    (item: POIItem) => {
      // 用户点了表头的「当前位置」虚拟项——它已经永远处于 active 态，且就是
      // centerPin 自己，flyMapTo 没有意义；setSelectedId(CURRENT_LOCATION_ID)
      // 反而会把"用户没点过列表"的语义打破，导致下一次重渲染时该项消失。
      // 直接 no-op 是最干净的处理。
      if (item.id === CURRENT_LOCATION_ID) return;
      if (tips !== null) {
        setKeyword("");
        setTips(null);
        moveTo(item.location.lng, item.location.lat);
        const seq = commitSeqRef.current;
        pickedPoiRef.current = {
          seq,
          name: item.name,
          address: item.address,
        };
        return;
      }
      setSelectedId(item.id);
      flyMapTo(item.location.lng, item.location.lat);
      const seq = commitSeqRef.current;
      pickedPoiRef.current = {
        seq,
        name: item.name,
        address: item.address,
      };
      const provider = providerRef.current;
      if (!provider) return;
      const promise = provider
        .reverseGeocode([item.location.lng, item.location.lat])
        .catch(() => null);
      reversePendingRef.current = { seq, promise };
      promise.then((rg) => {
        if (seq !== commitSeqRef.current) return;
        if (!rg) return;
        reverseCacheRef.current = { ...rg, seq };
      });
    },
    [tips, moveTo, flyMapTo],
  );

  // ===== 「确定」按钮 =====
  // 打车场景的核心契约：
  //   * **经纬度永远来自 centerRef.current（centerPin 针尖位置，100% 精准）**——
  //     不依赖任何 POI 项的坐标（与 centerPin 天然有几米~几十米误差）；
  //   * **永远基于 centerPin 经纬度调一次 reverseGeocode**——拿到该坐标对应的
  //     官方省市区 + 详细 address。这一步是"返回的是用户在地图上选中的那个地址"
  //     的核心保障：不论用户之前是拖图还是点列表项，这次反查的结果就是 centerPin
  //     当前位置的真实地址。
  //
  // 反查复用策略（避免重复请求，但保证一定有反查结果）：
  //   1) reverseCacheRef 命中（commitMapCenter / handlePickItem 后台反查已回来）→
  //      直接用，零延迟；
  //   2) 缓存未到 + reversePendingRef 还在飞 → await 它（已发起的请求别浪费）；
  //   3) 都没有（极端：刚拖完图立刻点确定，pending 已被新 seq 清掉）→ 现发起一次。
  //
  // 字段合并完整规则参见 buildSelectedLocation 注释——本函数只负责「拿到
  // geo + 候选 POI」这两份输入，拼装逻辑由 helper 统一承接，避免与列表头
  // 「当前位置」虚拟项 / 独立的 getLocation() 函数式 API 出现实现差异。
  const handleConfirm = useCallback(async () => {
    // 重复点击保护：网络慢时 reverseGeocode 可能 await 几百毫秒，期间用户多次
    // 点确定按钮，会进入多次 handleConfirm 并多次回调 onSelect——业务侧可能
    // 因此重复创建订单。一次进入即锁住，进入第二次直接 return。
    if (confirmingRef.current) return;
    confirmingRef.current = true;

    const center = centerRef.current;
    if (!center) {
      onClose?.();
      return;
    }
    const provider = providerRef.current;
    const currentSeq = commitSeqRef.current;

    let geo: ReverseGeocodeResult | null = null;
    const cache = reverseCacheRef.current;
    if (cache && cache.seq === currentSeq) {
      geo = cache;
    }
    if (!geo) {
      const pending = reversePendingRef.current;
      if (pending && pending.seq === currentSeq) {
        try {
          geo = await pending.promise;
        } catch {
          geo = null;
        }
      }
    }
    if (!geo && provider) {
      try {
        geo = await provider.reverseGeocode(center);
      } catch {
        geo = null;
      }
    }

    const picked = pickedPoiRef.current;
    const userPickedPoi =
      picked && picked.seq === currentSeq ? picked : null;

    // 拼装 SelectedLocation：与 currentItem useMemo / getLocation() 共用
    // buildSelectedLocation。candidatePoi = poiListRef[0]（仅在 userPickedPoi
    // 为空时被 helper 内部按 80m 阈值采纳），让「未点列表 → 直接确定」也能拿
    // 到楼栋/出入口级 name，规避 reverseGeocode fallback 到"街道镇"粗粒度。
    //
    // **经纬度依旧来自 centerRef，不切到 POI 经纬度**——保持"地图选什么
    // 就是什么"的契约，POI 仅供 name/address 文本兜底。
    const sel = buildSelectedLocation(center, geo, {
      pickedPoi: userPickedPoi
        ? { name: userPickedPoi.name, address: userPickedPoi.address }
        : undefined,
      candidatePoi: poiListRef.current[0] ?? null,
    });

    // onSelect 是业务方传入的回调，**有可能抛错**（业务代码 bug、错误的 props 等）。
    // 用 try/catch 兜住保证 onClose 一定会被调到，让组件能正常关闭——否则
    // 出错时弹窗会卡在打开状态，互斥锁也卡住。
    try {
      onSelect?.(sel);
    } catch (err) {
      console.warn("[MapLocationSelection] onSelect 抛错：", err);
    }
    onClose?.();
  }, [onSelect, onClose]);

  // ===== 列表头部「当前位置」虚拟项 =====
  //
  // 与 handleConfirm 的「未主动点 POI」分支同源——都通过 buildSelectedLocation
  // 拼装，让用户在列表里看到的"当前位置"就等于此刻按确定会提交的内容。
  // 共享 helper 后**不再需要 STAY-IN-SYNC 双源同步**——任何字段优先级 / 兜底
  // 调整只需改 buildSelectedLocation 一处。
  //
  // 与 handleConfirm 的差异（有意为之）：
  //   * picked 不参与：当前位置项的语义是"centerPin 自己"，与"用户主动选 POI"
  //     的 picked 维度互斥——picked !== null 时 selectedId !== null，currentItem
  //     不会被插入列表（见下方 list 合成），picked.name 自然不会影响 currentItem；
  //   * useMemo 读 poiList 用 React state；handleConfirm 读 poiListRef——两者
  //     在 React render 一致性下值相同，只是读写口径不同。
  const currentItem = useMemo<POIItem | null>(() => {
    void currentItemVersion;
    const center = centerRef.current;
    if (!center) return null;

    const cache = reverseCacheRef.current;
    const currentSeq = commitSeqRef.current;
    const geo = cache && cache.seq === currentSeq ? cache : null;

    const sel = buildSelectedLocation(center, geo, {
      candidatePoi: poiList[0] ?? null,
    });

    // distance 字段语义：
    //   * 列表所有项的 distance 展示口径 = "POI ↔ 用户真实 GPS 位置"，重合时
    //     才为 0m（详见 list 渲染处的 displayDistance 注释）。
    //   * 当前位置项的 location 就是 centerPin，所以这里 distance =
    //     "centerPin ↔ userLocation"——userLocation 未知（GPS 拒绝）时退化为 0。
    //   * 列表渲染时不直接读这个 distance 字段，而是用 displayDistance 现场算
    //     （读 currentItem.location 与 userLocation）。这里写值是为了语义一致 +
    //     兜底（万一 displayDistance 路径有改动，retest 时数据仍合理）。
    const distance = userLocation
      ? haversineMeters(center[0], center[1], userLocation[0], userLocation[1])
      : 0;

    return {
      id: CURRENT_LOCATION_ID,
      name: sel.name,
      address: sel.address,
      location: { lng: center[0], lat: center[1] },
      distance,
      raw: geo,
    };
  }, [currentItemVersion, poiList, userLocation]);

  // 列表渲染数据源：
  //   * 搜索模式（tips !== null）：直接用 tips（搜索结果），不插入 currentItem——
  //     用户搜索的意图是"找别处的地名"，此刻 centerPin 处的"当前位置"对结果
  //     筛选无意义；
  //   * 周边模式 + 用户没点过列表（selectedId === null）：把 currentItem 插到
  //     表头——这是"默认状态下的当前选择"；
  //   * 周边模式 + 用户点过列表（selectedId !== null）：**不插入** currentItem，
  //     避免 currentItem 与用户已选的 POI 在视觉上同时存在两条很相近的项。
  //     当前位置由用户已选的 POI 实际承载（active 高亮在那条上）。
  // 同名去重：currentItem 的 name 走 nearestPoi 兜底（80m 阈值内借用
  // poiList[0] 的名字，规避 reverseGeocode 在没楼宇位置 fallback 到 township
  // 粗粒度的"南码头路街道"问题）——这必然导致 currentItem.name 与 poiList[0].name
  // 一致。这种情况下 poiList[0] 从展示列表里去掉，避免「当前位置 0m + 同名 36m」
  // 两条几乎一样的项；currentItem 既已替它显示，且 distance=0m 是 centerPin
  // 真值，比 poiList[0] 的几十米距离更精确。
  // hasMore / 翻页行为不受影响——slice 只动展示数据，poiList 本身不变。
  const list = useMemo<POIItem[]>(() => {
    if (tips !== null) return tips;
    if (selectedId === null && currentItem) {
      const firstName = poiList[0]?.name?.trim() ?? "";
      const currentName = currentItem.name?.trim() ?? "";
      if (firstName && firstName === currentName) {
        return [currentItem, ...poiList.slice(1)];
      }
      return [currentItem, ...poiList];
    }
    return poiList;
  }, [tips, currentItem, poiList, selectedId]);
  const isTipsMode = tips !== null;

  const renderListContent = () => {
    if (errorMsg) return <div css={style.empty}>{errorMsg}</div>;
    if (list.length === 0) {
      return (
        <div css={style.empty}>
          {isTipsMode ? "未找到相关地点" : "暂无附近地点"}
        </div>
      );
    }
    return (
      <>
        {list.map((item) => {
          // 当前位置项**始终** active（用户需求："唯一区别是当前位置一定是
          // 选中状态"）；其他项保持原有 selectedId === item.id 判定。
          const active =
            item.id === CURRENT_LOCATION_ID || selectedId === item.id;
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
                {(() => {
                  // 距离展示口径：「POI ↔ 用户真实 GPS 位置」（"距离我多远"）。
                  // 仅当 userLocation 已知时按这个口径展示——重合时为 0m，符合
                  // 用户对"距离"二字的直觉认知（与微信发送位置 / 美团 / 滴滴等
                  // 主流产品对齐）。userLocation 未知（GPS 被拒 / 不可用）时退
                  // 化到 item.distance（即 POI ↔ centerPin），保持原有行为。
                  // 注意：列表内部排序仍按 item.distance（POI ↔ centerPin）升
                  // 序，所以拖图到远处选址时可能出现「显示 50km 排在 30km 前」
                  // 的视觉错位——这是排序口径（按 centerPin 找最近的 POI 给用
                  // 户参考）与展示口径（让用户读懂数字）有意分离的代价，已与
                  // 用户确认接受。
                  const displayDistance =
                    userLocation && item.location
                      ? haversineMeters(
                          item.location.lng,
                          item.location.lat,
                          userLocation[0],
                          userLocation[1],
                        )
                      : item.distance;
                  const distText =
                    typeof displayDistance === "number"
                      ? displayDistance < 1000
                        ? `${Math.round(displayDistance)}m`
                        : `${(displayDistance / 1000).toFixed(1)}km`
                      : "";
                  const addrText = item.address?.trim() ?? "";
                  if (!distText && !addrText) return null;
                  return (
                    <div css={style.itemDesc}>
                      {[distText, addrText].filter(Boolean).join(" | ")}
                    </div>
                  );
                })()}
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

        {/* 始终居中的 pin：容器位置永远固定（针尖对准地图中心）。
            抬起/落下动画只作用在 head 与 stem 上，针尖不会随之上下飘移，
            从而保证「拖动时看到的针尖位置」== 「松手后实际选中的中心点」。 */}
        <div css={style.centerPin}>
          <div
            // pinPhase 切到 drop 时以 key 重新挂载以重放动画
            key={`stem-${pinPhase}`}
            css={[
              style.centerPinStem,
              pinPhase === "lifted" && style.centerPinStemLifted,
              pinPhase === "drop" && style.centerPinStemDrop,
            ]}
          />
          <div
            key={`head-${pinPhase}`}
            css={[
              style.centerPinHead,
              pinPhase === "lifted" && style.centerPinHeadLifted,
              pinPhase === "drop" && style.centerPinHeadDrop,
            ]}
          />
        </div>

        {/* 顶部一行：返回（左 圆形图标按钮） / 确定（右 主行动按钮） */}
        <div css={style.topBar}>
          <Clickable
            css={style.cancelBtn}
            aria-label="返回"
            onClick={() => onClose?.()}
          >
            <span css={style.cancelBtnIcon} />
          </Clickable>
          <Clickable css={style.confirmBtn} onClick={handleConfirm}>
            确定
          </Clickable>
        </div>

        {/* 右下角：回到当前位置（远离高德 / 百度版权区域） */}
        {/* 加载中只在按钮自身上显示 spinner，整屏交互保持不阻断 */}
        <Clickable
          css={style.locateBtn}
          onClick={handleLocate}
          aria-busy={btnLocating || undefined}
        >
          {btnLocating ? (
            <span css={style.locateBtnSpinner} />
          ) : (
            <svg viewBox="0 0 1024 1024" css={style.locateBtnIcon}>
              <path d="M511.963002 316.994807c-107.263506 0-195.034191 87.767686-195.034191 195.034191 0 107.270505 87.770686 195.039191 195.034191 195.039191 107.270505 0 195.039191-87.767686 195.039191-195.039191 0-107.265505-87.769686-195.034191-195.039191-195.034191z m416.563779 148.490009C907.584049 272.331511 751.662489 116.414951 558.514184 95.474219V0.062996H465.42182V95.474219C272.270515 116.416951 116.352955 272.333511 95.412223 465.485816H0v93.084364h95.412223c20.940732 193.152305 176.860292 349.069865 370.009597 370.017597v95.412223h93.092364v-95.412223C751.660489 907.645045 907.584049 751.723485 928.526781 558.56918H1023.938004v-93.084364h-95.411223zM511.963002 853.345333c-187.718634 0-341.311335-153.589701-341.311334-341.316335 0-187.718634 153.5927-341.311335 341.311334-341.311334 187.725634 0 341.316334 153.5927 341.316335 341.311334 0 187.725634-153.5927 341.316334-341.316335 341.316335z" />
            </svg>
          )}
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
        {/* 搜索框：清空时列表自动 fallback 到 centerPin 周边列表（见 keyword effect）。
            locating 期间整体禁用，保证首次定位前用户拿不到错位的搜索结果。 */}
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
                // composition 结束时把最终字符同步到 state，避免被 setComposing 后的
                // 一次 batch 漏掉（onCompositionEnd 与 onChange 触发顺序在不同浏览器
                // 下不一致，显式 set 可保证最终态一定写入）。
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
            ref={scrollViewRef}
            height="100%"
            onReachBottom={handleReachBottom}
            reachBottomThreshold={80}
            // 错误 / 空 / 已加载完毕 / 搜索模式：不展示底部 loading
            // 搜索模式不分页（searchByKeyword 单页返回），底部 loading 没有意义
            showLoading={
              !isTipsMode && !errorMsg && hasMore && poiList.length > 0
            }
          >
            {renderListContent()}
          </ScrollView>
          {/* 列表数据加载中：半透明遮罩 + spinner，仅盖在 listArea 上不影响搜索框输入。
              locating 期间外层 bottomLockedMask 会以 zIndex=9 盖在最上层，
              此遮罩 zIndex=4 自然被遮住，不会出现"双层遮罩"视觉。 */}
          {listLoading && (
            <div css={style.listLoadingMask}>
              <div css={style.spinner} />
            </div>
          )}
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
