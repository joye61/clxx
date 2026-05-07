// MapProvider：把"具体地图 SDK"对 UI 层屏蔽掉的统一抽象。
//
// 设计原则：
//   - UI 不知道地图实例的存在，只通过 provider 操作；
//   - provider 内部坐标系自洽（amap=GCJ02、bmap=BD09），传入传出都是同一坐标系；
//   - 事件订阅是"注册一次，永不取消"——和当前 UI 行为对齐，避免 provider 内部
//     管理 listener 列表的复杂度；
//   - provider 在 init 之后才允许其它方法被调用，UI 层负责保证这个顺序。

import type { Coord, POIItem } from "./types";

export interface MapProviderInitOptions {
  container: HTMLElement;
  // 缺省时由 provider 自己用一个合理的 fallback（不同坐标系下数值不同）
  initialCenter?: Coord;
  initialZoom?: number;
  // AutoComplete / PlaceSearch 限定城市，"全国" 表示不限
  initialCity?: string;
  // 主题色，预留：百度 LocalSearch UI 不展示，但 provider 可保留以便扩展
  primary?: string;
}

export interface SearchOptions {
  page?: number; // 1-based，默认 1
  pageSize: number;
  radius: number;
}

export interface SearchAroundResult {
  pois: POIItem[];
  // 该页之后是否还有更多——hasMore 的具体计算逻辑下沉到各 provider，
  // 因为高德 / 百度的翻页机制差异较大，UI 只关心结果布尔值。
  hasMore: boolean;
}

export interface ReverseGeocodeResult {
  // 跟周边 POI 项 POIItem.name 完全同语义：附近 POI 名 / 楼宇 / 商圈 / 街道等
  // 「地点称呼」。逆地理失败 / 完全空白时为 ""，UI 兜底为「当前位置」。
  // 高德候选优先级：pois[0].name → 楼宇 → 商圈 → 街道乡镇
  // 百度候选优先级：surroundingPois[0].title → 商圈 → 镇/街道
  name: string;
  // 跟周边 POI 项 POIItem.address 完全同语义：「地点位置描述」
  // （短地址，如"上海市浦东新区科苑路 88 号"）。优先级——
  // 高德：pois[0].address → 完整 formattedAddress
  // 百度：surroundingPois[0].address → 完整 result.address
  address: string;
  province?: string;
  city?: string;
  district?: string;
  // 6 位国标 GB/T 2260 行政区划码（区县级）：
  //   - 高德：regeo.addressComponent.adcode（JSAPI）
  //   - 百度：webservice reverse_geocoding/v3 主路径 → addressComponent.adcode；
  //     JSAPI fallback 无可靠字段时为 undefined
  // UI 层用它推导省/市/区三级 6 位 code（前 2/4/6 位规则），写入 SelectedLocation。
  adcode?: string;
}

export interface GeolocateOptions {
  // 浏览器定位（H5 GPS / WiFi）失败或被拒时，是否允许 fallback 到 IP 定位
  // （城市级精度，通常 accuracy ≥ 5000m）。
  //
  // - **false（默认）**：H5 失败 / SDK 内部 fallback 到 IP 时，统一返回 null。
  //   适合"必须拿到精确位置"的场景，如打车上车点、外卖收货地址；
  // - **true**：返回 SDK 给的任何结果（含 IP 兜底）。适合"有大致位置就行"的场景，
  //   如门店推荐、城市级广告投放。
  //
  // 实现注意：高德 / 百度 JSAPI 都没有"禁用 IP 兜底"的显式开关，只能在拿到
  // 结果后**事后判定**。判定规则（在各 provider 内实现）：
  //   * 高德：result.location_type === 'ip' / 'cgi' 视为 IP；
  //     兜底再看 accuracy ≥ 5000m；
  //   * 百度：GeolocationResult 不暴露 type 字段，只能看 accuracy ≥ 5000m。
  // 5000m 阈值是保守值——室内 H5/WiFi 定位精度再差也很少超过 2km，5km
  // 完全是城市级 IP 才有的精度。
  allowIpFallback?: boolean;
}

export type MapProviderEvent = "movestart" | "moveend" | "click";

export interface MapProvider {
  // ===== 生命周期 =====
  init(opts: MapProviderInitOptions): Promise<void>;
  // 无 UI 模式：仅加载 SDK + 创建 service 类（Geolocation / Geocoder /
  // PlaceSearch / LocalSearch），**不创建 Map 实例**——也就**不需要 DOM
  // 容器、不会请求瓦片、不会渲染**。
  //
  // 用于函数式 getLocation 这种"我只想拿一个 SelectedLocation，不要任何
  // UI"的场景。SDK 的 Geolocation / Geocoder / PlaceSearch / LocalSearch
  // 等服务类**本身就独立于 Map 实例**（高德官方 Geolocation 示例、百度
  // LocalSearch 文档明示第一参数可传 Point/city 而非 Map），所以完全可以
  // 跳过 Map 创建——节省 ~5-10 个瓦片请求 + ~100-300ms 渲染开销。
  //
  // headless 模式下不可用的方法：
  //   - getCenter / setCenter / on('click'|'movestart'|'moveend') —— 没 Map
  //     就没视图概念；
  //   - upsertUserMarker —— 没 Map 就没法挂 overlay。
  // 可用：geolocate / reverseGeocode / searchAround / searchByKeyword。
  //
  // opts.initialCity：仅高德 PlaceSearch 构造时需要（关键字检索的城市口径），
  // 百度 LocalSearch 以 Point 为作用域，忽略该字段。
  initHeadless(opts?: Pick<MapProviderInitOptions, "initialCity">): Promise<void>;
  destroy(): void;

  // ===== 视图 =====
  // 返回当前地图中心（请保证 init 完成后才调用）
  getCenter(): Coord;
  // 程序化平移到目标点；UI 用 programmaticMoveRef 屏蔽此动作引发的搜索回环
  setCenter(center: Coord, zoom?: number): void;

  // ===== 用户位置标记（蓝点 + 涟漪），首次调用创建，之后调用仅移动位置 =====
  upsertUserMarker(center: Coord): void;

  // ===== 搜索 =====
  // 周边搜索（无关键字）：高德用 PlaceSearch.searchNearBy("", ...)，
  // 百度用 Geocoder.getLocation 取 surroundingPois（不支持翻页）。
  searchAround(
    center: Coord,
    options: SearchOptions,
  ): Promise<SearchAroundResult>;
  // 关键字搜索：高德 PlaceSearch.searchNearBy(kw)、百度 LocalSearch.searchNearby(kw)。
  // 返回值不分页（UI 只用单页结果），相关性排序由 UI 层基于命中规则做。
  searchByKeyword(
    center: Coord,
    keyword: string,
    options: SearchOptions,
  ): Promise<POIItem[]>;

  // ===== 定位 =====
  // 返回当前 provider 自身坐标系下的经纬度。失败 / 拒绝返回 null。
  // 内部应实现去抖：连续调用共享同一个进行中的请求。
  // options.allowIpFallback：见 GeolocateOptions 定义；缺省 false。
  geolocate(options?: GeolocateOptions): Promise<Coord | null>;

  // ===== 逆地理（确定按钮兜底）=====
  reverseGeocode(center: Coord): Promise<ReverseGeocodeResult | null>;

  // ===== 事件订阅（注册一次，永不取消）=====
  on(event: "movestart", handler: () => void): void;
  on(event: "moveend", handler: () => void): void;
  on(event: "click", handler: (lng: number, lat: number) => void): void;
}

export type MapProviderType = "amap" | "bmap";
