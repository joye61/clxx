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
  // 关键字检索专用：单独一个实例，init 时不设 type，调 ps.search(kw) 走"全文检索 + 按
  // 相关性排"语义。不能用 searchNearBy——searchNearBy 即使配 50km 半径，SDK 内部仍按
  // 相关度先过滤再返回，远端 POI（如 25km 外的虹桥火车站）会被首页的 20 条挤掉。
  // search(kw) 不限半径只限 city，能稳定命中全市范围内的远端 POI。
  private keywordPlaceSearch: any = null;
  private geocoder: any = null;
  private geolocation: any = null;
  private userMarker: any = null;
  // 当前定位反查到的城市名（reverseGeocode 成功后写入）。
  // search(kw) 是"按 city 范围做全文检索"——city 必须收敛到当前城市，
  // 否则 "全国" 范围里搜"地铁站"会按热度排返回北京/广州地铁站（实测距离 1000+km）。
  private cachedCity: string | null = null;

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
    // 业务方传入 initialCity 时直接以"本市 + cityLimit:true"创建关键字实例；
    // 否则保留 "全国" + cityLimit:false 兜底，等首次 reverseGeocode 拿到城市后由
    // buildKeywordPlaceSearch 重建（cityLimit 是不可变 init 参数，无法 setCityLimit）。
    if (o.initialCity) this.cachedCity = o.initialCity;
    this.keywordPlaceSearch = this.buildKeywordPlaceSearch(
      o.initialCity ?? "全国",
      !!o.initialCity,
    );
    // extensions=all 是关键：让 regeocode 一并返回 pois 数组（带 distance 字段）。
    // 默认值在不同 JSAPI 版本下会变（v1 默认 base / v2 默认 all），显式声明
    // 避免被 SDK 默认值变化打脸——reverseGeocode 内部需要 pois[].distance
    // 才能挑出"30m 内最贴近 centerPin 的精确 POI"。
    this.geocoder = new AMap.Geocoder({ extensions: "all" });
  }

  // 重新创建关键字 PlaceSearch 实例。之所以"重建"而不是"setCity"：
  //   - PlaceSearch 的 cityLimit 是构造时的 init 参数，SDK 没有暴露 setCityLimit；
  //   - 单纯 setCity('上海') 不开 cityLimit 的话，search('动物园') 会按全国范围相关性
  //     排，结果是北京动物园（5A 热度最高）排榜首——上海用户体验完全错位。
  // 所以拿到当前城市时必须重建实例并启用 cityLimit:true，让候选先收敛到本市。
  private buildKeywordPlaceSearch(city: string, cityLimit: boolean): any {
    if (!this.AMap) return null;
    return new this.AMap.PlaceSearch({
      pageSize: 20,
      pageIndex: 1,
      // 关键字检索不展开 child_pois——地铁站等多出入口父 POI 展开后会被同名条目刷屏。
      extensions: "base",
      city,
      citylimit: cityLimit,
    });
  }

  // 确保当前已经缓存到城市；没有就触发一次 reverseGeocode。
  // 用于堵住"用户进入页面就开始打字、reverseGeocode 还没完成"的时间窗口——
  // 这种情况下 keywordPlaceSearch 会停留在 city='全国' + cityLimit:false 的兜底状态，
  // 直接 search 会拿到外地结果。
  private async ensureCity(): Promise<void> {
    if (this.cachedCity) return;
    if (!this.map) return;
    const c = this.map.getCenter();
    // reverseGeocode 内部成功路径会同步重建 keywordPlaceSearch（cityLimit:true）
    await this.reverseGeocode([c.getLng(), c.getLat()]);
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
    this.keywordPlaceSearch = null;
    this.geocoder = null;
    this.geolocation = null;
    this.userMarker = null;
    this.pendingGeolocate = null;
    this.cachedCity = null;
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
    _center: Coord,
    keyword: string,
    options: SearchOptions,
  ): Promise<POIItem[]> {
    // 走关键字专用 PlaceSearch.search(keyword)：
    //   - "全文检索 + 按相关性排"语义，不限半径，只在 city 范围内匹配——
    //     "虹桥火车站"等远端 POI 能稳定命中，不会被 searchNearBy 的 SDK 内部相关度
    //     过滤挤掉首页；
    //   - 进入前先 ensureCity，确保 cachedCity 已经收敛到当前城市并已重建实例
    //     （cityLimit:true）——否则全国范围里搜"动物园"会返回北京动物园。
    // distance 由 UI 层 rewriteDistanceFromUser 用 haversine 重算（基于用户真实位置），
    // 再由 sortByKeywordRelevance 在同精准等级内按距离排——满足"精准匹配优先 + 距离次序"。
    //
    // seq 在 ensureCity 之前递增：用户连续输入时旧请求在 await 期间会被新请求作废，
    // ensureCity 返回后立即检查一次 seq，避免发起注定要被丢弃的 SDK 调用。
    const seq = ++this.keywordSeq;
    await this.ensureCity();
    if (seq !== this.keywordSeq) return [];
    const ps = this.keywordPlaceSearch;
    if (!ps) return [];
    return new Promise<POIItem[]>((resolve) => {
      ps.setPageIndex(1);
      ps.setPageSize(options.pageSize);
      ps.search(keyword, (status: string, result: any) => {
        if (seq !== this.keywordSeq) {
          resolve([]);
          return;
        }
        if (status !== "complete" || !result?.poiList?.pois) {
          resolve([]);
          return;
        }
        const list = (result.poiList.pois as any[])
          .map(normalizePOI)
          .filter((x): x is POIItem => !!x);
        resolve(list);
      });
    });
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
            // 把当前城市同步给 keywordPlaceSearch。注意 PlaceSearch 没有 setCityLimit
            // 方法（cityLimit 是不可变 init 参数），所以"city 变化"时必须重建整个实例，
            // 而不是 setCity——否则 cityLimit 仍是 init 时的 false，搜"动物园"会返回
            // 北京动物园（全国相关性按热度排）。
            // city 取空（海外 / 接口异常）时不动，保留上一次的值，避免短暂跨格子时
            // 频繁重建实例把已有结果搞乱。
            if (city && city !== this.cachedCity) {
              this.cachedCity = city;
              this.keywordPlaceSearch = this.buildKeywordPlaceSearch(
                city,
                true,
              );
            }
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
