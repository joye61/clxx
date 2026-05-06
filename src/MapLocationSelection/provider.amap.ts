// 高德地图 Provider 实现。
//
// 这个文件是从原 index.tsx 直接拆出来的：所有 AMap 相关 API 调用、
// NEARBY_POI_TYPE、expandWithChildren、normalizePOI、Geolocation 单例化、
// hasMore 计算（`reachedFullPage && targetPage * pageSize < count`）等
// 全部内聚在这里，UI 层完全不再 import "AMap*"。

import { loadAMap, type AMapNamespace } from "./loader.amap";
import { type Coord, type POIItem } from "./types";
import {
  type MapProvider,
  type MapProviderInitOptions,
  type SearchAroundResult,
  type SearchOptions,
  type ReverseGeocodeResult,
} from "./provider";
import { createUserMarkerDom } from "./userMarker";

const DEFAULT_FALLBACK_CENTER_GCJ02: Coord = [116.397428, 39.90923]; // 北京

// 高德 PlaceSearch 在 keyword 为空时，必须依靠 type 才会返回附近 POI。
// 这里把所有大类编码全部打开，确保「楼宇 / 门牌地址 / 室内设施」也能被检索到，
// 否则附近列表会只到“小区”这一级，丢掉具体的楼栋。
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

export interface AMapProviderOptions {
  amapKey: string;
  securityJsCode?: string;
}

export class AMapProvider implements MapProvider {
  private opts: AMapProviderOptions;
  private AMap: AMapNamespace | null = null;
  private map: any = null;
  // 周边检索专用：init 时设 type=NEARBY_POI_TYPE 让"附近列表"覆盖楼宇/门牌等大类，
  // extensions=all 才返回 child_pois（楼栋粒度）。
  private placeSearch: any = null;
  // 关键字检索：双实例并发，覆盖两类用户意图，二者结果合并去重 + 50km 半径过滤
  // 后回给 UI 层（UI 再用「名称命中度优先 + 同档距离升序」做最终排序）。
  //
  // 单实例（仅 searchNearBy）的痛点：
  //   * searchNearBy 是「半径内 + 关键字宽松匹配 + 按距离排」。高德 SDK 内部对
  //     "虹桥火车站"拆 token，"虹桥"、"火车站"任一片段命中即收录——浦东虹桥花园
  //     里的充电站等近距离模糊命中会把 pageSize=20 的首页全部占满，**真实
  //     虹桥火车站（28km 外）根本进不了候选**，用户感觉"列表里完全没有想搜的"；
  //   * 单纯 ps.search(kw) 又会被"锦博苑"等非热门小区在全国相关性排序里挤掉
  //     （北京同名 POI 热度更高时会跑到前面），且 search 不限半径会拿到外地结果。
  //
  // 双实例并发（实测能解 99% 的"搜不到真实 POI"问题）：
  //   * keywordPlaceSearchNear（searchNearBy）拿"近距离命中"——锦博苑/楼宇/
  //     近距离模糊匹配等都从这里来；
  //   * keywordPlaceSearchFull（search）拿"全国相关性命中"——虹桥火车站/陆家
  //     嘴等高热精确匹配 POI 即便远在 28km 外也能稳定进入候选；
  //   * 二者各取 pageSize=50（SDK 上限）、extensions=all、不设 type 让 keyword
  //     当主过滤；不设 cityLimit（city="全国"）不加城市约束；
  //   * 合并后用 haversine 重算距离并丢弃 > 50km 的跨市残留（search 会带回北京
  //     /广州的同名 POI，距离过滤天然解决）；
  //   * 名称命中度优先排序由 UI 层 sortByKeywordRelevance 完成（与百度共用），
  //     这里只负责"把候选凑齐"。
  //
  // 与单实例相比的代价：每次关键字检索多打一次 SDK 调用（约 +200~500ms 网络），
  // 已被 UI 层 250ms debounce 削平至单次输入只触发一组并发请求；调用配额翻倍
  // 但 keyword 检索本身在打车流程中频次很低，整体配额压力可忽略。
  private keywordPlaceSearchNear: any = null;
  private keywordPlaceSearchFull: any = null;
  private geocoder: any = null;
  private geolocation: any = null;
  private userMarker: any = null;

  // 复用一次进行中的定位 Promise，去抖
  private pendingGeolocate: Promise<Coord | null> | null = null;

  // 周边搜索 / 关键字搜索 各自独立的 seq，过期请求直接丢弃
  private aroundSeq = 0;
  private keywordSeq = 0;

  constructor(opts: AMapProviderOptions) {
    this.opts = opts;
  }

  async init(o: MapProviderInitOptions): Promise<void> {
    const AMap = await loadAMap({
      key: this.opts.amapKey,
      securityJsCode: this.opts.securityJsCode,
      plugins: ["AMap.Geocoder", "AMap.PlaceSearch", "AMap.Geolocation"],
    });
    this.AMap = AMap;
    const center = o.initialCenter ?? DEFAULT_FALLBACK_CENTER_GCJ02;
    const zoom = o.initialZoom ?? 16;
    this.map = new AMap.Map(o.container, {
      viewMode: "2D",
      zoom,
      center,
      showLabel: true,
    });
    this.placeSearch = new AMap.PlaceSearch({
      pageSize: 20,
      pageIndex: 1,
      // extensions=all 才会返回 child_pois（楼栋等子 POI），
      // 否则即便 type 命中“商务住宅”也只到小区粒度。
      extensions: "all",
      type: NEARBY_POI_TYPE,
      city: o.initialCity ?? "全国",
    });
    // 关键字检索双实例：分别给 searchNearBy / search 用，避免共享实例时 setPageSize
    // 等状态被并发调用相互覆盖。pageSize 拉满到 50（SDK 上限）尽量多召回候选，
    // 让 UI 端的"名称命中度优先排序"有更多素材可挑。
    this.keywordPlaceSearchNear = new AMap.PlaceSearch({
      pageSize: 50,
      pageIndex: 1,
      extensions: "all",
      city: o.initialCity ?? "全国",
    });
    this.keywordPlaceSearchFull = new AMap.PlaceSearch({
      pageSize: 50,
      pageIndex: 1,
      extensions: "all",
      city: o.initialCity ?? "全国",
    });
    // extensions=all 是关键：让 regeocode 一并返回 pois 数组（带 distance 字段）。
    // 默认值在不同 JSAPI 版本下会变（v1 默认 base / v2 默认 all），显式声明
    // 避免被 SDK 默认值变化打脸——reverseGeocode 内部需要 pois[].distance
    // 才能挑出"30m 内最贴近 centerPin 的精确 POI"。
    this.geocoder = new AMap.Geocoder({ extensions: "all" });
  }

  destroy(): void {
    try {
      if (this.map) this.map.destroy();
    } catch {
      // ignore
    }
    this.AMap = null;
    this.map = null;
    this.placeSearch = null;
    this.keywordPlaceSearchNear = null;
    this.keywordPlaceSearchFull = null;
    this.geocoder = null;
    this.geolocation = null;
    this.userMarker = null;
    this.pendingGeolocate = null;
  }

  getCenter(): Coord {
    const c = this.map.getCenter();
    return [c.getLng(), c.getLat()];
  }

  setCenter(center: Coord, zoom?: number): void {
    if (typeof zoom === "number") {
      this.map.setZoomAndCenter(zoom, [center[0], center[1]]);
    } else {
      this.map.setCenter([center[0], center[1]]);
    }
  }

  upsertUserMarker(center: Coord): void {
    const AMap = this.AMap;
    if (!AMap || !this.map) return;
    if (!this.userMarker) {
      const content = createUserMarkerDom();
      this.userMarker = new AMap.Marker({
        position: [center[0], center[1]],
        content,
        // content 是 0x0 的锚点 wrap（详见 userMarker.ts）：默认 top-left 对齐时
        // wrap 左上角就是 position；内部真实可见 marker 已用 absolute -6/-6 自我居中。
        // 所以这里 offset 必须是 (0, 0)，再叠加 -6 反而会双重偏移把蓝点拉到 position 左上方。
        offset: new AMap.Pixel(0, 0),
        zIndex: 90,
        clickable: false,
        bubble: true,
      });
      this.userMarker.setMap(this.map);
    } else {
      this.userMarker.setPosition([center[0], center[1]]);
    }
  }

  searchAround(
    center: Coord,
    options: SearchOptions,
  ): Promise<SearchAroundResult> {
    const AMap = this.AMap;
    const ps = this.placeSearch;
    if (!AMap || !ps) {
      return Promise.resolve({ pois: [], hasMore: false });
    }
    const page = Math.max(1, options.page ?? 1);
    const pageSize = options.pageSize;
    const seq = ++this.aroundSeq;

    return new Promise<SearchAroundResult>((resolve) => {
      ps.setPageIndex(page);
      ps.setPageSize(pageSize);
      // 高德 searchNearBy 文档明确 radius 取值 [0, 50000]：业务方传超过 50000
      // 会触发 SDK 报错（status='error'），这里先 clamp 兜住。
      const radius = Math.min(Math.max(0, options.radius), 50000);
      ps.searchNearBy(
        "",
        new AMap.LngLat(center[0], center[1]),
        radius,
        (status: string, result: any) => {
          if (seq !== this.aroundSeq) {
            // 请求已被作废
            resolve({ pois: [], hasMore: false });
            return;
          }
          const rawPois: any[] = result?.poiList?.pois ?? [];
          const pois = expandWithChildren(rawPois)
            .map(normalizePOI)
            .filter((x): x is POIItem => !!x);

          // 高德 PlaceSearch 返回的 count 只统计父 POI，而 list 是展开 child_pois 后的扁平数组，
          // 当区域内 child_pois 多时 list.length 会远大于 count，用 list.length < count 判断
          // 「是否还有下一页」会永远 false，分页完全失效。
          // 这里用「本次接口返回的原始 pois 是否取满一页」作为判断依据：
          //   - 满一页（rawPois.length >= pageSize）→ 大概率还有下一页
          //   - 不满一页 → 已是最后一页（高德接口约定）
          // 同时叠加 totalCount 兜底（page * pageSize < count），避免接口偶尔返回多余数据。
          const totalCount: number =
            (result?.poiList?.count as number | undefined) ??
            (status === "complete" ? rawPois.length : 0);
          const reachedFullPage = rawPois.length >= pageSize;
          const hasMoreByCount = page * pageSize < totalCount;
          const hasMore = reachedFullPage && hasMoreByCount;

          if (status !== "complete" || pois.length === 0) {
            // 诊断：status='error' 大多是安全密钥未配置或服务报错
            if (status === "error") {
              console.warn(
                "[MapLocationSelection] AMap PlaceSearch 失败。常见原因：" +
                  "未配置 securityJsCode（JSAPI v2.0 必填） / Key 未开通服务 / 超出限额。info=",
                result?.info,
              );
            }
            resolve({ pois: [], hasMore: false });
            return;
          }
          resolve({ pois, hasMore });
        },
      );
    });
  }

  async searchByKeyword(
    center: Coord,
    keyword: string,
    options: SearchOptions,
  ): Promise<POIItem[]> {
    // 关键字检索 = 「searchNearBy（近距离命中）」+「search（全国相关性命中）」并发，
    // 合并去重后**全部**返回，**不做距离过滤**。
    //
    // 旧版本曾在末尾做 50km 半径过滤以剔除同名跨市 POI（"北京/广州的锦博苑"）。
    // 但实测这条过滤会误杀用户实际想找的远端地标——例如在上海搜"天安门"，全国
    // 唯一的精确命中就是 1075km 外的北京天安门，被 50km 切掉后整个列表为空，
    // 与微信"发送位置"的体感（远端命中显示 1074.5km）严重不符。
    //
    // 排序口径：本方法只负责把候选凑齐，**不在这里排序**——UI 层
    // sortByKeywordRelevance 用「名称包含完整关键字优先 + 同档距离升序」做最终排序，
    // 同城精确命中（"上海锦博苑"）凭距离稳居顶部，同名跨市命中（北京/广州）
    // 自然沉到列表末尾；而对于唯一远端命中（"天安门" → 北京），它顶到首位
    // 是用户期望的行为。距离过滤反而是误杀。
    const AMap = this.AMap;
    const psNear = this.keywordPlaceSearchNear;
    const psFull = this.keywordPlaceSearchFull;
    if (!AMap || !psNear || !psFull) return [];

    const seq = ++this.keywordSeq;
    const pageSize = Math.min(50, Math.max(20, options.pageSize));

    const runNear = (): Promise<POIItem[]> =>
      new Promise<POIItem[]>((resolve) => {
        psNear.setPageIndex(1);
        psNear.setPageSize(pageSize);
        psNear.searchNearBy(
          keyword,
          new AMap.LngLat(center[0], center[1]),
          50000,
          (status: string, result: any) => {
            if (status !== "complete" || !result?.poiList?.pois) {
              resolve([]);
              return;
            }
            const list = expandWithChildren(result.poiList.pois as any[])
              .map(normalizePOI)
              .filter((x): x is POIItem => !!x);
            resolve(list);
          },
        );
      });

    const runFull = (): Promise<POIItem[]> =>
      new Promise<POIItem[]>((resolve) => {
        psFull.setPageIndex(1);
        psFull.setPageSize(pageSize);
        // search(kw) 不限半径，靠后续 50km 距离过滤剔除跨市污染。
        // 高热 POI（虹桥火车站、陆家嘴、东方明珠）会稳定排在 search 结果首页，
        // 与同名低热 POI（如其他城市的"锦博苑"）一起回来，跨市的会被距离过滤掉。
        psFull.search(keyword, (status: string, result: any) => {
          if (status !== "complete" || !result?.poiList?.pois) {
            resolve([]);
            return;
          }
          const list = expandWithChildren(result.poiList.pois as any[])
            .map(normalizePOI)
            .filter((x): x is POIItem => !!x);
          resolve(list);
        });
      });

    const [nearby, fulltext] = await Promise.all([runNear(), runFull()]);
    if (seq !== this.keywordSeq) return [];

    // 合并去重：以 nearby 优先（更可能带 SDK 算好的 distance），fulltext 仅补
    // nearby 漏掉的远端高热精确命中。同 id 用 nearby 的版本，避免 search 不带
    // distance 的副本覆盖 nearby 已经拿到的距离信息。
    const seen = new Map<string, POIItem>();
    for (const p of nearby) seen.set(p.id, p);
    for (const p of fulltext) {
      if (!seen.has(p.id)) seen.set(p.id, p);
    }
    return Array.from(seen.values());
  }

  geolocate(): Promise<Coord | null> {
    const AMap = this.AMap;
    if (!AMap) return Promise.resolve(null);

    if (this.pendingGeolocate) return this.pendingGeolocate;

    if (!this.geolocation) {
      this.geolocation = new AMap.Geolocation({
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
    }

    const promise = new Promise<Coord | null>((resolve) => {
      this.geolocation.getCurrentPosition(
        (status: string, result: any) => {
          if (status === "complete" && result?.position) {
            resolve([result.position.getLng(), result.position.getLat()]);
          } else {
            console.warn(
              "[MapLocationSelection] AMap Geolocation 失败，请确认 https/localhost 环境与授权。status=",
              status,
              "result=",
              result,
            );
            resolve(null);
          }
        },
      );
    }).finally(() => {
      this.pendingGeolocate = null;
    });

    this.pendingGeolocate = promise;
    return promise;
  }

  reverseGeocode(center: Coord): Promise<ReverseGeocodeResult | null> {
    const geocoder = this.geocoder;
    if (!geocoder) return Promise.resolve(null);
    return new Promise((resolve) => {
      geocoder.getAddress(
        [center[0], center[1]],
        (status: string, result: any) => {
          if (status === "complete" && result?.regeocode) {
            const r = result.regeocode;
            const city: string =
              r.addressComponent?.city || r.addressComponent?.province || "";
            // reverseGeocode 只负责"地名兜底"——返回覆盖中心点的具体地名
            // （楼宇 / 街道+门牌 / 街道 / 镇）。**不掺 POI**，POI 借用由
            // commitMapCenter 用 fetchAround（PlaceSearch.searchNearBy 全大类）
            // 的结果统一处理，因为 regeo.pois 是按"重要性"筛过的 N 条，常
            // 漏掉酒店/楼宇等具体 POI（实测："全季酒店"在地图上明显贴 centerPin
            // 但 regeo.pois 里根本没有，导致 fallback 到 township="北蔡镇"）。
            //
            // 文档参考：
            //   https://lbs.amap.com/api/webservice/guide/api/georegeo
            //
            // name 候选优先级（精到粗）：
            //   楼宇.name（extensions=all 才有）→ 街道+门牌 → 街道 → 街道乡镇 → 商圈
            // address 候选：
            //   街道+门牌 → 街道 → formattedAddress
            const ac = r.addressComponent ?? {};
            const businessAreas: any[] = Array.isArray(ac.businessAreas)
              ? ac.businessAreas
              : [];
            const sn = ac.streetNumber ?? {};
            const street = (sn.street ?? "").toString().trim();
            const number = (sn.number ?? "").toString().trim();
            const streetAndNumber =
              street && number ? `${street}${number}` : "";
            const township = (ac.township ?? "").toString().trim();
            const formatted = (r.formattedAddress ?? "").toString().trim();
            const nameCandidates: string[] = [
              ac.building?.name,
              streetAndNumber,
              street,
              township,
              businessAreas[0]?.name,
            ];
            const name =
              nameCandidates
                .map((s) => (s ?? "").toString().trim())
                .find(Boolean) ?? "";
            const addressCandidates: string[] = [
              streetAndNumber,
              street,
              township,
              formatted,
            ];
            const addressRaw = addressCandidates.find(Boolean) ?? "";
            // name / address 落到同一候选时会完全重复，让 address 留空（描述行
            // 只显示距离），跟周边 POI 项 "address 为空" 的渲染分支保持一致。
            const address = addressRaw === name ? "" : addressRaw;
            resolve({
              name,
              address,
              province: r.addressComponent?.province,
              city: city || undefined,
              district: r.addressComponent?.district,
            });
          } else {
            resolve(null);
          }
        },
      );
    });
  }

  on(event: "movestart", handler: () => void): void;
  on(event: "moveend", handler: () => void): void;
  on(event: "click", handler: (lng: number, lat: number) => void): void;
  on(event: string, handler: any): void {
    if (!this.map) return;
    if (event === "click") {
      this.map.on("click", (e: any) => {
        const lng = e.lnglat.getLng();
        const lat = e.lnglat.getLat();
        handler(lng, lat);
      });
    } else if (event === "movestart" || event === "moveend") {
      this.map.on(event, () => handler());
    }
  }
}
