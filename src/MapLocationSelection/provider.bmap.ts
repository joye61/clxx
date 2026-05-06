// 百度地图 BMapGL Provider 实现。
//
// 与高德相比的关键差异：
//   - 没有"无关键字周边检索"JSAPI：searchAround 走百度 Web 服务 API
//     `reverse_geocoding/v3` (extensions_poi=1 + entire_poi=1 +
//     sort_strategy=distance + poi_types=房地产|...) 拿楼宇/楼栋级 POI；
//     JSAPI 的 Geocoder.getLocation 只能给到"知名商铺"粒度，缺楼栋数据，
//     无法满足打车上车点 1m 级精度——故仅作 WebAPI 失败时的兜底。
//   - 没有内置 Geolocation 类：geolocate 走浏览器原生 navigator.geolocation
//     拿 WGS84，再用 BMapGL.Convertor 转 BD09；
//   - click 事件携带的是 e.point（不是高德的 e.lnglat）。
//
// 同一时刻只允许一个 LocalSearch 请求在飞：通过 localSearchResolver 互斥，
// 这与 UI 端 keyword 输入的事实节奏（debounce 后串行发起）天然契合，
// 不会出现"两个搜索同时返回"的竞态。

import { loadBMap } from "./loader.bmap";
import { type Coord, type POIItem, haversineMeters } from "./types";
import {
  type MapProvider,
  type MapProviderInitOptions,
  type SearchAroundResult,
  type SearchOptions,
  type ReverseGeocodeResult,
} from "./provider";

// 用户当前位置 marker 的静态 SVG。
//
// 之所以在百度端不用 DOM + CSS keyframes / 涟漪（高德端 createUserMarkerDom 那套）：
//   - BMapGL.CustomOverlay 在当前 SDK 版本下渲染锚点行为不稳定（实测 anchors / offsetX /
//     offsetY 都被静默忽略，与 map.centerAndZoom 同一坐标对不齐），所以必须用
//     BMapGL.Marker + BMapGL.Icon —— 它跟 map.setCenter / centerAndZoom 共享同一套坐标
//     转换，能保证 marker 中心与 centerPin 针尖（地图几何中心）严格重合；
//   - BMapGL.Icon 通过 dataURL 加载 SVG 时走的是 <img> 静态资源路径，浏览器把 SVG 当
//     普通图像，里面的 <animate>（SMIL）不会播放 —— 涟漪做不出来，故直接做静态点。
//
// 视觉规格：相对高德端 .mls-user-loc__dot（外径 12 px = 蓝色 9 + 白边 1.5）整体放大约 33%，
// 因为百度端没有涟漪辅助识别，单靠蓝点显眼度略弱，所以略大于高德但不至于喧宾夺主。
//
// 在 viewBox=64 中等比设计：r=24 + stroke=8（描边居中，半内半外）→ 外半径 28；
// CSS size=16 时 scale = 16/64 = 0.25：
//   蓝点直径（fill 区） = 2*(24-4)*0.25 = 10 CSS px
//   外径（含 stroke）   = 2*(24+4)*0.25 = 14 CSS px
// 对比原始 12 px 外径略大一圈，刚好够辨识又不显眼。
//
// SVG 自然尺寸 width/height=64（高于 size=16）给多 dpr 屏留足分辨率余量，
// 即便 SDK 内部走 raster 路径也不会模糊。
const USER_MARKER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><circle cx="32" cy="32" r="24" fill="#4575F6" stroke="#ffffff" stroke-width="8"/></svg>`;

const USER_MARKER_ICON_URL =
  "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(USER_MARKER_SVG);
const USER_MARKER_ICON_SIZE = 16;

const DEFAULT_FALLBACK_CENTER_BD09: Coord = [116.404, 39.915]; // 北京（BD09）

// 百度 BMAP_STATUS_SUCCESS = 0；这里直接用字面量，避免 SDK 加载完成前读全局常量
const BMAP_STATUS_SUCCESS = 0;

// 百度 Convertor 坐标系常量
const COORDINATES_WGS84 = 1;
const COORDINATES_BD09 = 5;

export interface BMapProviderOptions {
  ak: string;
  /**
   * 同域代理到百度 `reverse_geocoding/v3` 的路径（例如 Vite 配置里把 `/api/bmap-rgeo`
   * 转发到 `https://api.map.baidu.com/reverse_geocoding/v3`）。
   *
   * **为何需要**：浏览器直连百度时走 JSONP；若 AK 类型/Referer 白名单/服务权限
   * 有问题，百度常返回**裸 JSON**（不带 `callback(...)` 包裹），按 `<script>` 执行会
   * 语法错误，触发 `script.onerror` → 控制台「JSONP load error」。走同域代理后可用
   * `fetch` 解析 JSON，能稳定读到 `status/message` 并降级到 JSAPI。
   *
   * 生产环境可在网关配置等价转发；不配则仍用官方 JSONP（需控制台「浏览器端」AK +
   * Referer 白名单 + 开通全球逆地理编码）。
   */
  reverseGeocodingProxy?: string;
  /**
   * 同域代理到百度 `place/v2/search` 的路径——为关键字搜索的「全国跨城市命中」
   * 通道（让上海搜「天安门」也能召回北京天安门）。
   *
   * 不配置时默认走 JSONP，控制台需开通「Place API」服务、AK 为「浏览器端」、
   * Referer 白名单含当前域。配置语义与 reverseGeocodingProxy 一致——传完整路径，
   * 后端透传 query 后转发到 `https://api.map.baidu.com/place/v2/search`。
   */
  placeSearchProxy?: string;
}

function pointToCoord(p: any): { lng: number; lat: number } | null {
  if (!p) return null;
  if (typeof p.lng === "number" && typeof p.lat === "number") {
    return { lng: p.lng, lat: p.lat };
  }
  return null;
}

// 百度的 POI（surroundingPois / LocalSearch 结果）字段命名与高德不同：
//   title → name，point.lng/lat → location，uid → id；
//   surroundingPois 不带 distance，LocalSearch 也不一定带——统一用 haversine 兜底。
function normalizeBMapPOI(poi: any, center: Coord | null): POIItem | null {
  if (!poi) return null;
  const pt = pointToCoord(poi.point);
  if (!pt) return null;
  let distance: number | undefined;
  if (center) {
    distance = haversineMeters(center[0], center[1], pt.lng, pt.lat);
  }
  return {
    id: poi.uid || `${pt.lng},${pt.lat},${poi.title ?? ""}`,
    name: poi.title ?? "",
    address: poi.address ?? "",
    location: { lng: pt.lng, lat: pt.lat },
    cityname: poi.city,
    pname: poi.province,
    adname: poi.district,
    distance,
    raw: poi,
  };
}

// Web 服务 API `reverse_geocoding/v3` 返回的 pois[i] 字段：
//   { name, addr, point: { x, y }, distance, direction, uid, tag, poiType }
// 与 JSAPI 不同：用 addr 不是 address、point.x/y 不是 lng/lat。
// distance 是百度服务端算好的"POI ↔ 查询点"米数，UI 层仍会用 haversine 兜一道排序。
function normalizeWebAPIPoi(poi: any): POIItem | null {
  if (!poi || !poi.point) return null;
  const lng = typeof poi.point.x === "number" ? poi.point.x : NaN;
  const lat = typeof poi.point.y === "number" ? poi.point.y : NaN;
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
  const distRaw = (poi.distance ?? "").toString();
  const distNum = Number(distRaw);
  return {
    id: poi.uid || `${lng},${lat},${poi.name ?? ""}`,
    name: poi.name ?? "",
    address: poi.addr ?? "",
    location: { lng, lat },
    distance: Number.isFinite(distNum) ? distNum : undefined,
    raw: poi,
  };
}

// Web 服务 API `place/v2/search` 返回的 results[i] 字段：
//   { name, location: { lng, lat }, address, province, city, area, uid, telephone, ... }
// 与 reverse_geocoding/v3 的字段名不同（用 location 不是 point、address 不是 addr）。
// 不返回 distance（这个接口跨城市检索，距离要 UI 层用 haversine 自己算）。
function normalizePlaceSearchPoi(poi: any): POIItem | null {
  if (!poi || !poi.location) return null;
  const lng = typeof poi.location.lng === "number" ? poi.location.lng : NaN;
  const lat = typeof poi.location.lat === "number" ? poi.location.lat : NaN;
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
  return {
    id: poi.uid || `${lng},${lat},${poi.name ?? ""}`,
    name: poi.name ?? "",
    address: poi.address ?? "",
    location: { lng, lat },
    cityname: poi.city,
    pname: poi.province,
    adname: poi.area,
    raw: poi,
  };
}

// JSONP 工具：浏览器端调用百度 Web 服务 API 的标准方式。
// reverse_geocoding/v3 官方支持 callback=xxx 参数，绕过 CORS。
// 与 JSAPI 共用同一 ak（referer 白名单已生效），无需额外控制台配置。
function jsonp<T = any>(url: string, timeoutMs: number = 8000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    // 全局回调名：必须是合法 JS 标识符 + 唯一性，否则连续请求会相互覆盖
    const cbName = `__clxx_bmap_jsonp_${Date.now()}_${Math.floor(
      Math.random() * 1e6,
    )}`;
    const script = document.createElement("script");
    let timer: ReturnType<typeof setTimeout> | null = null;
    const cleanup = () => {
      delete (window as any)[cbName];
      if (script.parentNode) script.parentNode.removeChild(script);
      if (timer) clearTimeout(timer);
    };
    (window as any)[cbName] = (data: T) => {
      cleanup();
      resolve(data);
    };
    script.onerror = () => {
      cleanup();
      // 说明见 BMapProviderOptions.reverseGeocodingProxy 注释：百度在鉴权失败时往往返回裸
      // JSON，浏览器无法当脚本执行，必进 onerror（与网络断连、广告拦截等表现相同）。
      reject(
        new Error(
          "JSONP load error（常为：AK/Referer 未通过百度校验时接口返回裸 JSON 无法作为脚本执行；或请求被拦截/网络失败。可配置 reverseGeocodingProxy 走同域 fetch 解析）",
        ),
      );
    };
    timer = setTimeout(() => {
      cleanup();
      reject(new Error("JSONP timeout"));
    }, timeoutMs);
    const sep = url.indexOf("?") >= 0 ? "&" : "?";
    script.src = `${url}${sep}callback=${cbName}`;
    document.body.appendChild(script);
  });
}

// reverse_geocoding/v3 的 poi_types 白名单：覆盖打车 / 网约车场景下所有合理的
// 上车点 POI 类型（除"自然地物"外的全部一级大类）。
//
// 历史版本只列了 11 类（房地产/公司/交通/教育/医疗/酒店/购物/美食/生活服务/
// 政府/金融），实测在郊区 / 工业园区 / 风景区一带这套白名单 + 200m 半径常常
// 只能召回 2-3 条 POI——把景点 / 加油站 / 电影院 / 健身房等用户实际可能要去的
// 场景全部漏掉。打车业务的现实是「**任何**有名字的地标都可能是上车点」，所以
// 白名单需要尽可能宽。
//
// **保留"自然地物"以外**：自然地物指山川 / 湖泊 / 河流等——它们没有上车点
// 语义，让保留只会让"长江"/"东湖"占据列表噪声，故仍排除。
//
// 类型清单参考：https://lbsyun.baidu.com/index.php?title=lbscloud/poitags
const POI_TYPES_FOR_PICKUP = [
  "房地产",
  "公司企业",
  "交通设施",
  "教育培训",
  "医疗",
  "酒店",
  "购物",
  "美食",
  "生活服务",
  "政府机构",
  "金融",
  "旅游景点",
  "休闲娱乐",
  "运动健身",
  "文化传媒",
  "汽车服务",
].join("|");

export class BMapProvider implements MapProvider {
  private opts: BMapProviderOptions;
  private BMap: any = null;
  private map: any = null;
  private userMarker: any = null;

  private localSearch: any = null;
  private localSearchResolver: ((res: any) => void) | null = null;

  private geocoder: any = null;
  private convertor: any = null;

  private pendingGeolocate: Promise<Coord | null> | null = null;

  private aroundSeq = 0;
  private keywordSeq = 0;

  constructor(opts: BMapProviderOptions) {
    this.opts = opts;
  }

  async init(o: MapProviderInitOptions): Promise<void> {
    const BMap = await loadBMap({ ak: this.opts.ak });
    this.BMap = BMap;

    const center = o.initialCenter ?? DEFAULT_FALLBACK_CENTER_BD09;
    const zoom = o.initialZoom ?? 16;

    this.map = new BMap.Map(o.container, {
      // 关闭底图 POI 点击，避免与组件 click 处理冲突
      enableIconClick: false,
    });
    // BMapGL 必须显式调用 centerAndZoom 才能开始渲染瓦片
    this.map.centerAndZoom(new BMap.Point(center[0], center[1]), zoom);

    // BMapGL 默认关闭双指缩放与滚轮缩放（仅默认开启拖拽 + 双击放大），
    // 与高德 Map 默认体感不一致 —— 必须显式启用，否则 H5 端用户「捏不动」、
    // PC 端用户「滚不动」，看起来就像地图不能缩放。
    if (typeof this.map.enablePinchToZoom === "function") {
      this.map.enablePinchToZoom(true);
    }
    if (typeof this.map.enableScrollWheelZoom === "function") {
      this.map.enableScrollWheelZoom(true);
    }
    // 双击放大默认开启，这里冗余声明一次，防止某些 SDK 版本默认值被改动
    if (typeof this.map.enableDoubleClickZoom === "function") {
      this.map.enableDoubleClickZoom(true);
    }

    this.geocoder = new BMap.Geocoder();
    if (typeof BMap.Convertor === "function") {
      this.convertor = new BMap.Convertor();
    }
  }

  destroy(): void {
    try {
      if (this.map && typeof this.map.destroy === "function") {
        this.map.destroy();
      }
    } catch {
      // ignore
    }
    if (this.localSearchResolver) {
      const r = this.localSearchResolver;
      this.localSearchResolver = null;
      r(null);
    }
    this.BMap = null;
    this.map = null;
    this.userMarker = null;
    this.localSearch = null;
    this.geocoder = null;
    this.convertor = null;
    this.pendingGeolocate = null;
  }

  getCenter(): Coord {
    const c = this.map.getCenter();
    return [c.lng, c.lat];
  }

  setCenter(center: Coord, zoom?: number): void {
    const BMap = this.BMap;
    const point = new BMap.Point(center[0], center[1]);
    // 视图过渡策略（参见 SKILL map-init.md）：
    //   - 统一用 flyTo(point, zoom)：SDK 一次性完成中心 + zoom 的平滑过渡，
    //     体感与高德 AMap.Map.setCenter / setZoomAndCenter 默认动画一致。
    //   - 不带 zoom 时也走 flyTo(point, currentZoom)：因为 BMapGL.panTo 在目标点距离
    //     当前视野较远时会被 SDK 自己降级为瞬变 setCenter（实测列表点击较远 POI 即触发），
    //     而 flyTo 没有这个距离阈值，能保证任何距离都是丝滑动画——与高德端表现拉齐。
    //   - 极端兜底：flyTo 不存在时用 setCenter + setZoom 拆开调（禁用 centerAndZoom，
    //     部分 BMapGL 版本下二次调用 centerAndZoom 会清空所有覆盖物，把蓝点 marker 也带走）。
    const targetZoom = typeof zoom === "number" ? zoom : this.map.getZoom();
    if (typeof this.map.flyTo === "function") {
      this.map.flyTo(point, targetZoom);
      return;
    }
    this.map.setCenter(point);
    if (typeof zoom === "number" && this.map.getZoom() !== zoom) {
      this.map.setZoom(zoom);
    }
  }

  upsertUserMarker(center: Coord): void {
    const BMap = this.BMap;
    if (!BMap || !this.map) return;
    const point = new BMap.Point(center[0], center[1]);

    // 更新策略：每次都 removeOverlay + addOverlay 重建，而不是 marker.setPoint。
    //
    // 原因：
    //   - 实测部分 BMapGL 版本下，已添加的 marker 调用 setPoint(point) 后内部坐标
    //     更新了，但屏幕渲染位置没刷新，肉眼看起来就是"蓝色 marker 消失"；
    //   - removeOverlay + addOverlay 重新走完整渲染管线，对齐和显示都最稳；
    //   - 用户触发的频率低（GPS 定位、点击「回到当前位置」），重建成本可忽略。
    if (this.userMarker) {
      try {
        this.map.removeOverlay(this.userMarker);
      } catch {
        // 极端情况下 marker 已被 SDK 内部清除（例如旧版本 centerAndZoom 副作用），
        // 这里 remove 失败不影响后续 add，吞掉异常即可。
      }
      this.userMarker = null;
    }

    // 用 BMapGL.Marker + Icon 替代 CustomOverlay：SDK 内置 marker 与地图本身共享同一套
    // 坐标转换，同一个 BMapGL.Point 喂给 map 和喂给 marker，屏幕落点严格一致。
    // 设置 icon.anchor = (size/2, size/2) 让 SVG 几何中心对齐 point。
    const icon = new BMap.Icon(
      USER_MARKER_ICON_URL,
      new BMap.Size(USER_MARKER_ICON_SIZE, USER_MARKER_ICON_SIZE),
      {
        anchor: new BMap.Size(
          USER_MARKER_ICON_SIZE / 2,
          USER_MARKER_ICON_SIZE / 2,
        ),
      },
    );
    const marker = new BMap.Marker(point, {
      icon,
      enableDragging: false,
      enableMassClear: false,
    });
    this.map.addOverlay(marker);
    this.userMarker = marker;
  }

  // 周边搜索：双路并发召回 + 跨源去重，目标是把 list 填到 30+ 条让用户有足够
  // 翻动空间，同时保证 list[0] 是「楼栋级、距 centerPin 最近」的高质量结果。
  //
  // 打车 / 网约车「上车点」精度方案（最终版 v2）：
  //   1) 主路径 A — reverse_geocoding/v3 (extensions_poi=1 + entire_poi=1 +
  //      sort_strategy=distance + radius=1000 + poi_types=...)：
  //      百度官方"楼宇级 POI 召回 + 距离优先"接口，拿楼宇 / 写字楼 / 小区楼栋 /
  //      出入口 / 路边商铺这些 JSAPI surroundingPois 拿不到的细粒度 POI，
  //      list 顶部精度可稳定到 1~5m 级。**单次接口、不支持翻页、密度低时偏稀疏**。
  //   2) 主路径 B — LocalSearch fan：对 5 个常见分类关键字并发跑 searchNearby
  //      （pageCapacity=50），合并去重后能补 30-80 条 POI 兜住"郊区/工业园只
  //      返回 2-3 条"的稀疏问题。**没有楼栋粒度，但宽广度好**。
  //   3) 兜底 — JSAPI Geocoder.getLocation：上面两条都为空时（鉴权未开/网络
  //      异常），降级到 surroundingPois，保证组件总有结果。
  //
  // 合并优先级：A 优先（楼栋粒度更细，常常包含 list[0] 的最优解），B 仅作补集；
  // 重复 POI 以 A 的版本为准。最终 UI 层会做 sortByDistance 让 list[0] 总是离
  // centerPin 最近的那条。
  //
  // 不支持翻页：百度两路接口都是一次性返回，hasMore 恒为 false；但因双路合并后
  // 候选量已经达到 30-80 条，UI 上滑动展示完全够用，分页缺失不再是体感瓶颈。
  async searchAround(
    center: Coord,
    options: SearchOptions,
  ): Promise<SearchAroundResult> {
    const BMap = this.BMap;
    if (!BMap || !this.geocoder) {
      return { pois: [], hasMore: false };
    }
    const page = Math.max(1, options.page ?? 1);
    if (page > 1) {
      // 不支持翻页：UI 在 hasMore=false 时不会再触发翻页，这里仅作冗余兜底
      return { pois: [], hasMore: false };
    }
    const seq = ++this.aroundSeq;

    // 双路并发：Promise.all 让总耗时只取决于慢的一路（≈ 600-900ms）。
    const [webApiPois, fanPois] = await Promise.all([
      this.searchAroundViaWebAPI(center, options),
      this.searchAroundViaLocalSearchFan(center, options),
    ]);
    if (seq !== this.aroundSeq) return { pois: [], hasMore: false };

    const seen = new Map<string, POIItem>();
    // WebAPI 优先：楼栋级 POI 一般只有 reverse_geocoding/v3 能召回。
    for (const p of webApiPois ?? []) {
      if (!seen.has(p.id)) seen.set(p.id, p);
    }
    for (const p of fanPois) {
      if (!seen.has(p.id)) seen.set(p.id, p);
    }
    const pois = Array.from(seen.values());
    if (pois.length > 0) {
      return { pois, hasMore: false };
    }

    // 兜底路径：JSAPI Geocoder.getLocation（精度差，但保证组件总有结果）
    const fallbackPois = await this.searchAroundViaJSAPI(center, options);
    if (seq !== this.aroundSeq) return { pois: [], hasMore: false };
    return { pois: fallbackPois, hasMore: false };
  }

  // 走百度 Web 服务 API `reverse_geocoding/v3`（楼宇级精度的真正实现）。
  // 失败 / 返回空时返回 null，让外层走兜底路径。
  private async searchAroundViaWebAPI(
    center: Coord,
    options: SearchOptions,
  ): Promise<POIItem[] | null> {
    // radius：官方文档 poi 召回半径 0–3000m（超过按 3000 截断）。
    //
    // 下限 1000m 故意**覆盖** options.radius 的小默认值（200m）：百度此接口是
    // 一炮型，没有翻页机制，半径太小直接限死了召回总量。打车场景下用户在郊区 /
    // 工业园区 / 风景区开图常常 200m 内只有 2-3 条 POI，体感上"列表几乎空"。
    // 这里强行拉到 ≥1000m 让一次召回拿足量；最终列表仍按 sort_strategy=distance
    // 升序排，最近的楼栋 / 商铺 / 出入口稳居顶部，远端 POI 仅作"翻页式"补足。
    //
    // 业务方真要更窄半径（< 1000m）也无意义——百度接口在 1000m 以下与 1000m 返回
    // 集合差别不大（都是"路口附近一坨"），但少于 1000m 时会偶发返回 0 条；统一抬到
    // 1000m 是稳定性 / 体感的双优解。
    const radius = Math.min(Math.max(options.radius, 1000), 3000);
    // location：lat,lng，保留 6 位小数与官方示例一致，避免极长浮点偶发参数校验问题
    const lat = center[1].toFixed(6);
    const lng = center[0].toFixed(6);
    const params = [
      `ak=${encodeURIComponent(this.opts.ak)}`,
      `output=json`,
      `coordtype=bd09ll`,
      `location=${lat},${lng}`,
      `extensions_poi=1`,
      `entire_poi=1`,
      `sort_strategy=distance`,
      `radius=${radius}`,
      `poi_types=${encodeURIComponent(POI_TYPES_FOR_PICKUP)}`,
    ].join("&");

    let data: any;
    const proxy = this.opts.reverseGeocodingProxy?.trim();
    try {
      if (proxy) {
        const base = proxy.replace(/\/$/, "");
        const res = await fetch(`${base}?${params}`);
        data = await res.json();
      } else {
        data = await jsonp<any>(
          `https://api.map.baidu.com/reverse_geocoding/v3/?${params}`,
          6000,
        );
      }
    } catch (err) {
      console.warn(
        "[MapLocationSelection] reverse_geocoding/v3 请求失败，降级到 JSAPI。",
        "若未配置 bmapReverseGeocodingProxy：请确认 AK 为「浏览器端」、Referer 白名单含当前域名、控制台已开通「全球逆地理编码」。",
        "鉴权失败时百度常返回裸 JSON，JSONP 会表现为 load error。",
        err,
      );
      return null;
    }
    if (!data || data.status !== 0 || !data.result) {
      // status 非 0：常见 200(权限不足，需在控制台开"逆地理编码服务") /
      //            240(校验失败，referer 不在白名单) / 302(配额耗尽)
      if (data && data.status !== 0) {
        console.warn(
          "[MapLocationSelection] reverse_geocoding/v3 status=" +
            data.status +
            " message=" +
            (data.message || data.msg || ""),
        );
      }
      return null;
    }
    const rawPois: any[] = Array.isArray(data.result.pois)
      ? data.result.pois
      : [];
    if (rawPois.length === 0) return null;
    return rawPois
      .map(normalizeWebAPIPoi)
      .filter((x): x is POIItem => !!x);
  }

  // 兜底：走 JSAPI Geocoder.getLocation。精度受限（surroundingPois 不返回楼栋），
  // 仅在 WebAPI 失败 / 鉴权未开通时使用。
  private searchAroundViaJSAPI(
    center: Coord,
    options: SearchOptions,
  ): Promise<POIItem[]> {
    const BMap = this.BMap;
    if (!BMap || !this.geocoder) return Promise.resolve([]);
    // 半径上限 50m：让 SDK 跳过"重要度筛选"分支，候选数量天然 ≤ numPois。
    const poiRadius = Math.min(50, Math.max(10, options.radius));
    const numPois = Math.max(20, options.pageSize);
    return new Promise<POIItem[]>((resolve) => {
      this.geocoder.getLocation(
        new BMap.Point(center[0], center[1]),
        (result: any) => {
          if (!result) {
            resolve([]);
            return;
          }
          const surroundings: any[] = Array.isArray(result.surroundingPois)
            ? result.surroundingPois
            : [];
          const ac = result.addressComponents || {};
          const pois = surroundings
            .map((p) =>
              normalizeBMapPOI(
                {
                  ...p,
                  province: p.province ?? ac.province,
                  city: p.city ?? ac.city,
                  district: p.district ?? ac.district,
                },
                center,
              ),
            )
            .filter((x): x is POIItem => !!x);
          resolve(pois);
        },
        {
          poiRadius,
          numPois,
        },
      );
    });
  }

  // LocalSearch 扇形补足：reverse_geocoding/v3 是单次接口、没有翻页，密度低的
  // 区域常常只能拿 2-3 条 POI。这里对几个最常见的「上车点-相关」分类关键字
  // 并发跑 LocalSearch，每个 50 条，合并去重后通常能再补 30-80 条，把列表填
  // 到可滑动级别。
  //
  // 为何不复用 this.localSearch + setPageNum 翻页？
  //   1) 共享实例同时只允许一个请求在飞（searchByKeyword 也在用），跨调用复用
  //      会与关键字模式互踩；
  //   2) LocalSearch 单次最大 pageCapacity=50，翻页是按相关度排序，远距离 POI
  //      也会上来——对周边搜索（按距离）反而是噪声；
  //   3) 多关键字并发 + 距离重写 + 顶层 sortByDistance 已经能稳定"近→远"序。
  //
  // 关键字选择：覆盖打车场景下用户最可能去的目的地大类（公司/小区/酒店/商场/
  // 餐厅），每类在百度 POI 库都有充沛存量；不再多加避免无谓的并发请求。
  private async searchAroundViaLocalSearchFan(
    center: Coord,
    options: SearchOptions,
  ): Promise<POIItem[]> {
    const BMap = this.BMap;
    if (!BMap || !this.map) return [];
    // 半径：补足类用 max(options.radius, 2000)，比 WebAPI 1000m 再大一档；
    // LocalSearch 没有 3000m 上限，UI 最终按距离升序，远端 POI 自然排末尾。
    const radius = Math.min(Math.max(options.radius, 2000), 5000);
    const keywords = ["公司", "小区", "酒店", "商场", "餐厅"];
    const tasks = keywords.map((kw) =>
      this.singleLocalSearchOnce(kw, center, radius, 50),
    );
    const results = await Promise.all(tasks);
    // 跨关键字去重：以 id 为键，先到先得（顺序与 keywords 一致，公司类优先）。
    const seen = new Map<string, POIItem>();
    for (const list of results) {
      for (const p of list) {
        if (!seen.has(p.id)) seen.set(p.id, p);
      }
    }
    return Array.from(seen.values());
  }

  // 一次性 LocalSearch.searchNearby——为 fan 检索配套的"轻量、独立"实例。
  // 不复用 this.localSearch 是为了避开 searchByKeyword 的 mutex 冲突。
  private singleLocalSearchOnce(
    keyword: string,
    center: Coord,
    radius: number,
    pageCapacity: number,
  ): Promise<POIItem[]> {
    const BMap = this.BMap;
    if (!BMap || !this.map) return Promise.resolve([]);
    return new Promise<POIItem[]>((resolve) => {
      const ls = new BMap.LocalSearch(this.map, {
        pageCapacity,
        onSearchComplete: (results: any) => {
          if (!results) {
            resolve([]);
            return;
          }
          const status =
            typeof ls.getStatus === "function"
              ? ls.getStatus()
              : BMAP_STATUS_SUCCESS;
          if (status !== BMAP_STATUS_SUCCESS) {
            resolve([]);
            return;
          }
          const num =
            typeof results.getCurrentNumPois === "function"
              ? results.getCurrentNumPois()
              : 0;
          const list: POIItem[] = [];
          for (let i = 0; i < num; i++) {
            const poi = results.getPoi(i);
            const item = normalizeBMapPOI(poi, center);
            if (item) list.push(item);
          }
          resolve(list);
        },
      });
      try {
        ls.setPageNum(0);
        ls.searchNearby(keyword, new BMap.Point(center[0], center[1]), radius);
      } catch (err) {
        console.warn(
          "[MapLocationSelection] LocalSearch fan 调用失败：",
          err,
        );
        resolve([]);
      }
    });
  }

  // 关键字检索 = 「LocalSearch.searchNearby（≤100km 同城/邻城精确命中 + 距离）」
  // + 「place/v2/search?region=全国（跨城市相关性命中）」并发，合并去重后**全部**返回。
  //
  // 为何要双路：百度 LocalSearch.searchNearby 的 radius 上限是 100km（SDK 文档值），
  // 而打车业务里用户在上海搜"天安门"需要召回 1075km 外的北京天安门，单靠 LocalSearch
  // 永远拿不到。引入 place/v2/search 全国检索通道兜住"远端唯一精确命中"的场景，
  // 与微信"发送位置"的体感对齐（远端命中显示 1074.5km）。
  //
  // 排序口径：本方法只负责凑齐候选，**不在这里排序 / 距离过滤**——UI 层
  // sortByKeywordRelevance 用「名称包含完整关键字优先 + 同档距离升序」做最终排序，
  // 同城精确命中（"上海锦博苑"）凭距离稳居顶部，跨市同名命中（北京/广州）自然
  // 沉到列表末尾；唯一远端命中（"天安门"）因 tier-0 名称匹配也会顶到首位。
  async searchByKeyword(
    center: Coord,
    keyword: string,
    options: SearchOptions,
  ): Promise<POIItem[]> {
    const BMap = this.BMap;
    if (!BMap || !this.map) return [];

    const seq = ++this.keywordSeq;

    const [nearby, nationwide] = await Promise.all([
      this.searchByKeywordViaLocalSearch(center, keyword, options),
      this.searchByKeywordViaPlaceSearchAPI(keyword),
    ]);
    if (seq !== this.keywordSeq) return [];

    // 合并去重：nearby 优先（带 SDK 算好的精确 distance），nationwide 仅补 nearby
    // 漏掉的远端高热精确命中。同 uid 用 nearby 的版本，避免 WebAPI 不带 distance
    // 的副本覆盖 nearby 已经拿到的距离信息。
    const seen = new Map<string, POIItem>();
    for (const p of nearby) seen.set(p.id, p);
    for (const p of nationwide) {
      if (!seen.has(p.id)) seen.set(p.id, p);
    }
    return Array.from(seen.values());
  }

  // LocalSearch 通道：当前地图所在城市/100km 内周边检索；走 SDK 共享实例 + mutex。
  private searchByKeywordViaLocalSearch(
    center: Coord,
    keyword: string,
    options: SearchOptions,
  ): Promise<POIItem[]> {
    const BMap = this.BMap;
    if (!BMap || !this.map) return Promise.resolve([]);

    return new Promise<POIItem[]>((resolve) => {
      // 同一时刻只允许一个 LocalSearch 在飞：若有未完成的请求，让它先以 null 收尾。
      if (this.localSearchResolver) {
        const r = this.localSearchResolver;
        this.localSearchResolver = null;
        r(null);
      }
      if (!this.localSearch) {
        this.localSearch = new BMap.LocalSearch(this.map, {
          pageCapacity: options.pageSize,
          onSearchComplete: (results: any) => {
            const r = this.localSearchResolver;
            this.localSearchResolver = null;
            if (r) r(results);
          },
        });
      } else {
        this.localSearch.setPageCapacity(options.pageSize);
      }
      this.localSearch.setPageNum(0);

      this.localSearchResolver = (results: any) => {
        if (!results) {
          resolve([]);
          return;
        }
        const status =
          typeof this.localSearch.getStatus === "function"
            ? this.localSearch.getStatus()
            : BMAP_STATUS_SUCCESS;
        if (status !== BMAP_STATUS_SUCCESS) {
          resolve([]);
          return;
        }
        const list: POIItem[] = [];
        const num =
          typeof results.getCurrentNumPois === "function"
            ? results.getCurrentNumPois()
            : 0;
        for (let i = 0; i < num; i++) {
          const poi = results.getPoi(i);
          const item = normalizeBMapPOI(poi, center);
          if (item) list.push(item);
        }
        resolve(list);
      };
      // 半径策略：默认 options.radius=1000 太小覆盖不到全市热门 POI，下限拉到 50000；
      // 上限 100000 来自百度 LocalSearch 文档（"周边检索半径最大 100000 米"），
      // 业务方传更大的值 SDK 会内部 clamp，这里显式收敛避免后续 SDK 行为差异。
      const tipRadius = Math.min(
        Math.max(options.radius, 50000),
        100000,
      );
      this.localSearch.searchNearby(
        keyword,
        new BMap.Point(center[0], center[1]),
        tipRadius,
      );
    });
  }

  // place/v2/search 通道：全国跨城市相关性命中。是搜「天安门」/「故宫」/「外滩」
  // 这类远端唯一精确命中的唯一可行渠道（LocalSearch 100km 上限永远到不了）。
  //
  // - region=全国 + region_limit=false：跨城市召回，不对单一行政区做硬过滤
  // - page_size=20：与 UI 默认 pageSize 对齐，单次足够给出主要候选
  // - extensions_adcode=true：让 results[i] 带上 province/city/area，方便 UI 区别同名
  // - 超时 3000ms：交互式检索容忍度较低，超时直接放弃（默认 LocalSearch 那路仍能给结果）
  private async searchByKeywordViaPlaceSearchAPI(
    keyword: string,
  ): Promise<POIItem[]> {
    const params = [
      `ak=${encodeURIComponent(this.opts.ak)}`,
      `query=${encodeURIComponent(keyword)}`,
      `region=${encodeURIComponent("全国")}`,
      `region_limit=false`,
      `output=json`,
      `coord_type=3`,
      `ret_coordtype=bd09ll`,
      `page_size=20`,
      `extensions_adcode=true`,
    ].join("&");

    let data: any;
    const proxy = this.opts.placeSearchProxy?.trim();
    try {
      if (proxy) {
        const base = proxy.replace(/\/$/, "");
        const res = await fetch(`${base}?${params}`);
        data = await res.json();
      } else {
        data = await jsonp<any>(
          `https://api.map.baidu.com/place/v2/search?${params}`,
          3000,
        );
      }
    } catch (err) {
      console.warn(
        "[MapLocationSelection] place/v2/search 请求失败，跨城市搜索将无补充结果。",
        "若未配置 bmapPlaceSearchProxy：请确认 AK 为「浏览器端」、Referer 白名单含当前域名、控制台已开通「Place API」服务。",
        err,
      );
      return [];
    }
    if (!data || data.status !== 0 || !Array.isArray(data.results)) {
      if (data && data.status !== 0) {
        // status 非 0 常见取值：200(权限不足，需开 Place API) /
        //                     240(校验失败，referer 不在白名单) / 302(配额耗尽)
        console.warn(
          "[MapLocationSelection] place/v2/search status=" +
            data.status +
            " message=" +
            (data.message || data.msg || ""),
        );
      }
      return [];
    }
    const rawPois: any[] = data.results;
    return rawPois
      .map(normalizePlaceSearchPoi)
      .filter((x): x is POIItem => !!x);
  }

  // 定位：浏览器原生 geolocation 拿 WGS84 → Convertor 转 BD09。
  // - 无 Convertor / 转换失败时，退化为直接使用 WGS84（视觉上有偏移，但比无定位好）；
  // - in-flight Promise 复用，达到与高德 Geolocation 等价的去抖体验。
  geolocate(): Promise<Coord | null> {
    if (this.pendingGeolocate) return this.pendingGeolocate;

    const BMap = this.BMap;
    if (!BMap || typeof navigator === "undefined" || !navigator.geolocation) {
      return Promise.resolve(null);
    }

    const promise = new Promise<Coord | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const wgs: Coord = [pos.coords.longitude, pos.coords.latitude];
          if (!this.convertor) {
            resolve(wgs);
            return;
          }
          this.convertor.translate(
            [new BMap.Point(wgs[0], wgs[1])],
            COORDINATES_WGS84,
            COORDINATES_BD09,
            (data: any) => {
              if (data?.status === 0 && data.points?.[0]) {
                resolve([data.points[0].lng, data.points[0].lat]);
              } else {
                resolve(wgs);
              }
            },
          );
        },
        (err) => {
          console.warn(
            "[MapLocationSelection] BMap navigator.geolocation 失败，请确认 https/localhost 环境与授权。code=",
            err.code,
            "message=",
            err.message,
          );
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        },
      );
    }).finally(() => {
      this.pendingGeolocate = null;
    });

    this.pendingGeolocate = promise;
    return promise;
  }

  reverseGeocode(center: Coord): Promise<ReverseGeocodeResult | null> {
    const BMap = this.BMap;
    const geocoder = this.geocoder;
    if (!BMap || !geocoder) return Promise.resolve(null);
    return new Promise((resolve) => {
      geocoder.getLocation(
        new BMap.Point(center[0], center[1]),
        (result: any) => {
          if (!result) {
            resolve(null);
            return;
          }
          const ac = result.addressComponents || {};
          // reverseGeocode 只负责"地名兜底"，name 候选只从行政地名拼：
          //   第一个商圈 → 镇 → 街道（这些都是覆盖中心点的"具体地名"）。
          // POI 借用由 commitMapCenter 用 searchAround 的结果统一处理，
          // 跟高德对称。
          const business = (result.business ?? "").toString().trim();
          const firstBusiness = business
            ? business.split(/,|，/)[0]?.trim()
            : "";
          const nameCandidates: string[] = [firstBusiness, ac.town, ac.street];
          const name =
            nameCandidates
              .map((s) => (s ?? "").toString().trim())
              .find(Boolean) ?? "";
          const fullAddr = (result.address ?? "").toString().trim();
          // name / address 偶尔会完全相同（如同时 fallback 到 town），让 address
          // 留空，跟周边 POI 项「address 为空只渲染距离」的分支保持一致。
          const address = fullAddr === name ? "" : fullAddr;
          resolve({
            name,
            address,
            province: ac.province,
            city: ac.city || ac.province,
            district: ac.district,
          });
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
        // BMapGL 官方 SKILL 内部对经纬度字段的描述自相矛盾：
        //   - base-classes.md 示例：经纬度在 e.latlng（GL 版本主流写法）；
        //   - map-events.md 表格：经纬度在 e.point（与老 BMap 一致）。
        // 实测部分版本下 e.point 是 EarthMC 地理墨卡托坐标（百万级米），当经纬度用
        // 会让地图跳到地球另一角落 —— 这正是"百度地图一点就偏到不知道哪里"的根因。
        // 取值优先级（从最稳到兜底）：
        //   1) e.latlng：GL 主流字段，明确是 BD09 经纬度；
        //   2) e.pixel + map.pixelToPoint(pixel)：屏幕像素→经纬度，API 跨版本稳定；
        //   3) e.point：仅当前两者都不存在时才用，并校验数值落在合法经纬度区间，
        //      避免把 EarthMC 米数喂出去。
        const isValidLngLat = (lng: number, lat: number) =>
          lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
        let lng: number | undefined;
        let lat: number | undefined;
        if (
          e?.latlng &&
          typeof e.latlng.lng === "number" &&
          typeof e.latlng.lat === "number"
        ) {
          lng = e.latlng.lng;
          lat = e.latlng.lat;
        } else if (e?.pixel && typeof this.map.pixelToPoint === "function") {
          const p = this.map.pixelToPoint(e.pixel);
          if (p && typeof p.lng === "number" && typeof p.lat === "number") {
            lng = p.lng;
            lat = p.lat;
          }
        } else if (
          e?.point &&
          typeof e.point.lng === "number" &&
          typeof e.point.lat === "number" &&
          isValidLngLat(e.point.lng, e.point.lat)
        ) {
          lng = e.point.lng;
          lat = e.point.lat;
        }
        if (typeof lng === "number" && typeof lat === "number") {
          handler(lng, lat);
        }
      });
    } else if (event === "movestart" || event === "moveend") {
      this.map.on(event, () => handler());
    }
  }
}
