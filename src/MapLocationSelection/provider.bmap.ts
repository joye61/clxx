// 百度地图 BMapGL Provider 实现（v5.3 — 反查切到 webservice + 内置 Geolocation）。
//
// 设计目标：
//   - 完全依赖百度 JSAPI（BMap.LocalSearch + BMap.Geocoder），不再调用任何
//     Web 服务 API（reverse_geocoding/v3、place/v2/search）；
//   - 不需要 referer 白名单之外的额外鉴权（共用 JSAPI 的 ak），不需要同域代理；
//   - 代码量大幅缩减（从 ~1180 行降到 ~700 行），无 jsonp、proxy、跨源 fetch 链路；
//   - 与高德 PlaceSearch.searchNearBy 全大类召回的实现风格对齐：周边搜索走
//     "多关键字数组覆盖 + 距离 dedupe"，关键字搜索走单次 LocalSearch.search
//     + forceLocal: false（同城精确命中 + 本城无命中时 SDK 自动回退全国）。
//
// 关键差异（与历史版本）：
//   - 弃用 reverse_geocoding/v3：JSAPI Geocoder.getLocation 已经覆盖反查 + 周边
//     POI（surroundingPois）。后者精度低于 Web API 但与 LocalSearch fan-out 互补，
//     不再单独使用；
//   - 弃用 place/v2/search 的多关键字 / 全国通道：使用 LocalSearch.search +
//     forceLocal: false 替代——纯 JSAPI 同样能拿到"上海搜北京天安门"的跨城命中，
//     与高德 / 微信"发送位置"的搜索体感对齐；
//   - **v5.2 重构**：利用百度官方文档明确支持的 LocalSearch.searchNearby
//     **keyword 数组形式**（一次最多 10 个关键字），把原来"21 个独立 LocalSearch
//     实例并发"压成"3 组多关键字 LocalSearch 并发"——HTTP 请求数从 21 → 3，
//     绕开浏览器单域 6 个并发连接的限制（之前 21 并发会被分批排队，部分串行化）。
//     onSearchComplete 在多关键字时返回 LocalResult[] 数组，runLocalSearch
//     已统一兼容单 / 多关键字两种回调格式。
//
// **v5.3 追加变更**（解决"百度地图不返回省市区 code"）：
//   - **reverseGeocode 主路径切到 webservice `reverse_geocoding/v3`** + jsonp：
//     BMapGL JSAPI 的 AddressComponent 类参考文档明确只有 streetNumber / street /
//     district / city / province 5 个字段，**不含 adcode**——这与高德 JSAPI
//     端能直接拿到 adcode 形成跛脚。webservice `reverse_geocoding/v3` 的
//     addressComponent 包含 country / province / city / district / town /
//     adcode（int 类型）等完整字段，且与 JSAPI 共用同一个 ak（referer 白
//     名单一致），用 jsonp 在浏览器直调即可，无需服务端代理；
//   - **geolocate 切到 BMapGL.Geolocation**：原 navigator.geolocation +
//     BMapGL.Convertor 两步式被官方内置 Geolocation 类一次替代——内部融合
//     浏览器 H5 定位 + IP 定位 + 安卓 SDK 辅助定位，自动产出 BD09，不再需要
//     COORDINATES_WGS84/BD09 常量与 Convertor 实例。
//
// 与高德相比的关键差异（仍然适用）：
//   - 没有"无关键字周边检索" JSAPI：百度 LocalSearch.searchNearby 必须给 keyword，
//     所以 searchAround 必须 fan-out 多个关键字；
//   - click 事件携带的是 e.latlng / e.pixel，e.point 在部分版本下是 EarthMC 米数。

import { loadBMap } from "./loader.bmap";
import { type Coord, type POIItem } from "./types";
import {
  type GeolocateOptions,
  type MapProvider,
  type MapProviderInitOptions,
  type SearchAroundResult,
  type SearchOptions,
  type ReverseGeocodeResult,
} from "./provider";
import { jsonp } from "../utils/jsonp";

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
const USER_MARKER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><circle cx="32" cy="32" r="24" fill="#4575F6" stroke="#ffffff" stroke-width="8"/></svg>`;

const USER_MARKER_ICON_URL =
  "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(USER_MARKER_SVG);
const USER_MARKER_ICON_SIZE = 16;

const DEFAULT_FALLBACK_CENTER_BD09: Coord = [116.404, 39.915]; // 北京（BD09）

// 百度 BMAP_STATUS_SUCCESS = 0；这里直接用字面量，避免 SDK 加载完成前读全局常量
const BMAP_STATUS_SUCCESS = 0;

// IP 定位判定阈值：accuracy ≥ 此值视为 IP 兜底（城市级精度）。
// 与高德端 IP_LOCATION_ACCURACY_THRESHOLD_M 保持一致——5km 远超室内 H5
// 定位误差上限（最差也罕见 > 2km），完全是城市级 IP 才有的精度。
//
// 百度 BMapGL.GeolocationResult 文档只暴露 accuracy / address / point 三个
// 字段，**没有 location_type**——只能靠 accuracy 阈值识别。
const IP_LOCATION_ACCURACY_THRESHOLD_M = 5000;

export interface BMapProviderOptions {
  ak: string;
}

// 周边搜索的关键字集合：覆盖打车 / 网约车「上车点」场景的细粒度 POI。
//
// 百度 LocalSearch.searchNearby 必须给 keyword，没法用空 keyword 拉所有 POI
// （高德 PlaceSearch.searchNearBy("", ..., type=NEARBY_POI_TYPE) 那套不可用）。
// 而且百度 LocalSearch **不返回 child_pois**——大型 POI 的子 POI（小区楼栋 /
// 商场店铺 / 加油站厕所等）只能靠**手工 fan-out 细粒度关键字**召回，没有别的
// 路径。每个关键字独立发起一次 LocalSearch 并发拉取，最后合并 dedupe，效果上
// 接近高德全大类 + child_pois 展开的召回粒度。
//
// 关键字分组（按打车场景上车点频次排序）：
//   ① 一级大类（高频上车点母 POI，对应百度 17 大类的代表关键字）：
//      房地产    → 小区                 交通设施 → 地铁站、公交站、停车场
//      公司企业  → 公司                 教育培训 → 学校
//      酒店      → 酒店                 医疗     → 医院
//      购物      → 商场、超市           金融     → 银行
//      美食      → 餐厅                 旅游景点 → 景点、公园
//                                       汽车服务 → 加油站
//   ② 细粒度补充（**用户明确要求"粒度细到极致"**——加油站厕所 / 楼栋出入口
//      这种独立 POI 在大类下不会被召回，必须独立 fan-out）：
//      便利店  ← 罗森 / 全家 / 7-11 等便利店连锁（"超市"召回不全）
//      快餐    ← KFC / 麦当劳 / 汉堡王（"餐厅"主要命中正餐）
//      咖啡    ← 星巴克 / 瑞幸（高频上车点）
//      充电站  ← 新能源车补给（"加油站"不命中）
//      厕所    ← 公共厕所 / 加油站厕所 / 商场厕所（独立 POI 类型）
//      出入口  ← 地铁出入口 / 商场出入口 / 小区南门东门（楼栋粒度的入口）
//
// 总请求量：**仅 3 个 LocalSearch.searchNearby**（21 个关键字按每组 10 个切片）。
// 利用百度官方 keyword: String | Array 的多关键字 API（详见 searchAround 内
// 的注释），把"每个关键字一次独立请求"压成"一次请求带多关键字数组"——总耗时
// 由 max(单次 LocalSearch) 决定，绕开浏览器单域 6 个并发连接的限制。
const NEARBY_KEYWORDS = [
  "公司",
  "小区",
  "酒店",
  "商场",
  "超市",
  "便利店",
  "餐厅",
  "快餐",
  "咖啡",
  "地铁站",
  "公交站",
  "停车场",
  "学校",
  "医院",
  "银行",
  "景点",
  "公园",
  "加油站",
  "充电站",
  "厕所",
  "出入口",
];

// 把百度 LocalSearch / Geocoder.surroundingPois 返回的 POI 字段标准化为 POIItem。
//
// 字段命名差异：百度用 title（不是 name）、point.lng/lat（不是 location）、uid（不是 id）。
// SDK 没有给"POI ↔ 查询点"的距离字段，distance 留 undefined，统一交给 UI 层
// rewriteDistanceFromCenter 用 haversine 算（球面距离精度，与高德端口径完全一致）。
function normalizeBMapPOI(poi: any): POIItem | null {
  if (!poi || !poi.point) return null;
  const lng = typeof poi.point.lng === "number" ? poi.point.lng : NaN;
  const lat = typeof poi.point.lat === "number" ? poi.point.lat : NaN;
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
  const name = (poi.title ?? "").toString();
  const address = (poi.address ?? "").toString();
  return {
    id: poi.uid || `${lng},${lat},${name}`,
    name,
    address,
    location: { lng, lat },
    cityname: poi.city,
    pname: poi.province,
    adname: poi.district,
    raw: poi,
  };
}

export class BMapProvider implements MapProvider {
  private opts: BMapProviderOptions;
  private BMap: any = null;
  private map: any = null;
  private userMarker: any = null;

  private geocoder: any = null;
  // BMapGL.Geolocation 单例：getCurrentPosition 内部融合浏览器 H5 定位 +
  // IP 定位 + 安卓 SDK 辅助定位，自动返回 BD09 坐标。比 navigator.geolocation
  // + Convertor 两步式更可靠（H5 定位失败时自动降级到 IP，能拿到城市级位置
  // 而不是直接 null）。
  private geolocation: any = null;

  private pendingGeolocate: Promise<Coord | null> | null = null;

  private aroundSeq = 0;
  private keywordSeq = 0;

  constructor(opts: BMapProviderOptions) {
    this.opts = opts;
  }

  // 加载 SDK + 创建所有 service 类（Geocoder / Geolocation 单例）。
  // BMapGL.LocalSearch 不在这里创建——它每次 runLocalSearch 内部都会 new
  // 一份并配独立的 onSearchComplete 回调，**且第一参数就是 BMap.Point 而
  // 非 Map 实例**（详见 v5.x 头部注释中"LocalSearch 构造第一个参数传
  // BMap.Point 而非 this.map"），所以 LocalSearch **本就独立于 Map**。
  // 抽出来共用：组件 init 与 headless initHeadless 的"加载 SDK + service"
  // 部分完全相同，分别写两份是重复代码。
  private async initServices(): Promise<any> {
    const BMap = await loadBMap({ ak: this.opts.ak });
    this.BMap = BMap;
    this.geocoder = new BMap.Geocoder();
    // 创建 Geolocation 单例：内部首次 getCurrentPosition 时才会真正发起定位，
    // 这里仅创建对象本身（无网络 / 权限副作用）。
    if (typeof BMap.Geolocation === "function") {
      this.geolocation = new BMap.Geolocation();
    }
    return BMap;
  }

  async init(o: MapProviderInitOptions): Promise<void> {
    const BMap = await this.initServices();

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
  }

  // headless：仅 service 类，不创建 Map 实例 → 不挂容器 / 不下载瓦片 /
  // 不渲染。详见 MapProvider.initHeadless 接口注释。
  // opts.initialCity：百度 LocalSearch 以 Point 为作用域，此处忽略（仅为接口对齐）。
  async initHeadless(
    _opts?: Pick<MapProviderInitOptions, "initialCity">,
  ): Promise<void> {
    await this.initServices();
  }

  destroy(): void {
    try {
      if (this.map && typeof this.map.destroy === "function") {
        this.map.destroy();
      }
    } catch {
      // ignore
    }
    this.BMap = null;
    this.map = null;
    this.userMarker = null;
    this.geocoder = null;
    this.geolocation = null;
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

  // 周边搜索：纯 JSAPI 多关键字数组检索（v5.2 重构）。
  //
  // 实现策略：
  //   1) 把 NEARBY_KEYWORDS（21 个关键字）按 KEYWORDS_PER_REQUEST=10 切成
  //      多组（10 / 10 / 1）；
  //   2) 每组 new 一个独立 BMap.LocalSearch 实例，并发发起
  //      searchNearby(keyword[], point, radius)——百度官方支持 keyword 数组形式，
  //      一次最多 10 个关键字（自 1.2 版本起，详见 LocalSearch 文档）；
  //   3) 单实例 setPageCapacity(50) 拿首页满量，不翻页（关键字数组已保证候选数）；
  //   4) Promise.all 等所有完成后合并 by uid 去重，UI 层 sortByDistance 排序。
  //
  // 为何用多关键字数组（不是 21 次独立请求）：
  //   - **HTTP 请求数从 21 → 3**——浏览器单域并发连接限制（一般 6 个）下，21 个
  //     独立请求会被分批排队，前 6 个先发后 15 个等待，部分串行化拖慢总耗时；
  //     3 个请求一次发完，每个请求内部由百度后端并发处理多关键字；
  //   - 百度后端处理多关键字应该是合并查询，相比 21 次独立查询省 RTT 与服务端
  //     重复的"中心点 + 半径"运算；
  //   - onSearchComplete 在多关键字时回调 LocalResult[]，runLocalSearch 已经
  //     统一归一化（见 runLocalSearch 注释）。
  //
  // 为何独立实例不共享：BMap.LocalSearch 单实例同时只能跑一个 search 请求
  // （onSearchComplete 回调只有一份，复用会被互踩）。所以 3 组之间必须 3 个
  // 独立实例。
  //
  // 总请求量：3 个并发 LocalSearch.searchNearby（每组 ≤10 关键字）。与高德 1 个
  // PlaceSearch.searchNearBy 全 type 召回相比仍是 3:1 劣势，但这是百度 SDK
  // 不提供"无关键字全大类周边"接口、且 LocalSearch 不返回 child_pois 的客观
  // 限制——必须靠多关键字覆盖（含厕所 / 充电站 / 出入口等细粒度）才能兜出与
  // 高德全大类 + child_pois 展开等价的召回粒度。
  //
  // 不支持翻页：百度 LocalSearch 翻页时 SDK 按相关度（不是按距离）排，远端 POI
  // 也会被翻上来，对周边场景反而是噪声。UI 层 hasMore=false 让翻页按钮隐藏。
  async searchAround(
    center: Coord,
    options: SearchOptions,
  ): Promise<SearchAroundResult> {
    // 仅检查 SDK 加载完成——不依赖 this.map（headless 模式下可用）
    if (!this.BMap) {
      return { pois: [], hasMore: false };
    }
    const page = Math.max(1, options.page ?? 1);
    if (page > 1) {
      // 不支持翻页：UI 在 hasMore=false 时不会再触发翻页，这里仅作冗余兜底
      return { pois: [], hasMore: false };
    }
    const seq = ++this.aroundSeq;

    // radius 钳制：1000-5000m。下限 1000 是因为低密度区域（郊区 / 工业园）
    // 200m 半径常常返回空；上限 5000 兼顾响应速度与召回总量。
    const radius = Math.min(Math.max(options.radius, 1000), 5000);
    const pageCapacity = Math.min(50, Math.max(20, options.pageSize));

    // 百度官方上限：LocalSearch.searchNearby 的 keyword 数组最多 10 个。
    // 21 个关键字按 10/10/1 切成 3 组并发——每个分组在 SDK 内部一次请求带多
    // 关键字（百度后端合并查询），3 个分组在浏览器层并发发出。
    const KEYWORDS_PER_REQUEST = 10;
    const groups: string[][] = [];
    for (let i = 0; i < NEARBY_KEYWORDS.length; i += KEYWORDS_PER_REQUEST) {
      groups.push(NEARBY_KEYWORDS.slice(i, i + KEYWORDS_PER_REQUEST));
    }

    const tasks = groups.map((group) =>
      this.runLocalSearchNearby(group, center, radius, pageCapacity),
    );
    const results = await Promise.all(tasks);
    if (seq !== this.aroundSeq) return { pois: [], hasMore: false };

    // 跨关键字 dedupe by uid：同一 POI 可能命中多个关键字（如"罗森便利店"既是
    // "超市"也是"便利店"），保留先到的版本即可——字段完全一致。
    const seen = new Map<string, POIItem>();
    for (const list of results) {
      for (const p of list) {
        if (!seen.has(p.id)) seen.set(p.id, p);
      }
    }
    return { pois: Array.from(seen.values()), hasMore: false };
  }

  // 关键字搜索：LocalSearch.search(keyword) + forceLocal: false。
  //
  // search vs searchNearby 的关键区别：
  //   - searchNearby(keyword, point, radius)：以 point 为圆心 radius 半径的圆形
  //     检索，受 radius 强约束（SDK 上限 100km），不会跨城；
  //   - search(keyword)：在 LocalSearch 构造时配置的 location 范围内检索
  //     （location = Point 时取 Point 所在城市），按相关度返回。配合
  //     forceLocal: false，本城无命中时 SDK 会自动扩展到全国。
  //
  // forceLocal: false 的命中行为（百度 JSAPI 官方约定）：
  //   - "虹桥火车站"在上海有精确命中 → 返回上海命中（同城精度不降级）；
  //   - "天安门"在上海无真正"天安门"地标命中 → SDK 自动扩展全国 → 返回北京天安门。
  //   这正是高德 / 微信"发送位置"的搜索体感。
  //
  // 与 UI 层的配合：
  //   - search() 不像 searchNearby() 严格按距离排序，SDK 给的顺序是相关度；
  //   - UI 端 sortByKeywordRelevance 仍负责"名称命中度分级 + 同档距离升序"排序，
  //     跨城远距离命中会排在同城精确命中之后；
  //   - 距离字段在 UI 端用 haversineMeters 重算（rewriteDistanceFromCenter），
  //     与 SDK 给的口径解耦，跨城距离显示也准确。
  async searchByKeyword(
    center: Coord,
    keyword: string,
    options: SearchOptions,
  ): Promise<POIItem[]> {
    if (!this.BMap) return [];
    const seq = ++this.keywordSeq;
    const pageCapacity = Math.min(50, Math.max(20, options.pageSize));
    const list = await this.runLocalSearchKeyword(
      keyword,
      center,
      pageCapacity,
    );
    if (seq !== this.keywordSeq) return [];
    return list;
  }

  // 单次 LocalSearch 调用 → POIItem[] 的统一封装。
  //
  // 关键约定（与历史踩坑教训）：
  //   * **LocalSearch 构造第一个参数传 BMap.Point 而非 this.map**——这是修
  //     "首次进入列表跑到 1000+ km 之外"的关键。BMap.LocalSearch(location, opts)
  //     的 location 决定 SDK 内部"检索作用域"：
  //       - 传 BMap.Map：SDK 把 map 当前所在城市当作检索作用域，**会忽略**
  //         searchNearby(keyword, point, radius) 第二个参数指定的 point 城市——
  //         典型反例：map 在北京（fallback 中心未被 setCenter 切到上海前），
  //         即便 searchNearby 传 上海 point + 5km，SDK 仍然把 keyword 限制在
  //         北京全市检索 → 列表全是北京 POI；
  //       - 传 BMap.Point：SDK 直接以 point 所在城市作为检索作用域，与
  //         searchNearby 的 location 参数完全对齐。
  //     这是 BMapGL JSAPI 的反直觉行为，文档没明说但实测必踩。统一用 Point
  //     构造彻底切断对 map 当前 city 状态的依赖。
  //   * **每次 new 一个 LocalSearch 实例**：避免共享实例的 mutex 串行化——
  //     fan-out 必须并发，串行总耗时 ≈ 15 × 单次 ≈ 6-12s 不可接受；
  //   * **status 非 SUCCESS 时返回空数组**（不 reject）：让上层 Promise.all
  //     对单关键字失败容忍，其它关键字仍能贡献候选；
  //   * **跨城回退命中**（forceLocal: false 时）部分版本 SDK 会返回 status = 4
  //     (CITY_LIST，建议用户从城市列表选择)。这里只接受 SUCCESS = 0，让 UI
  //     表现稳定不需要弹城市选择列表——业务方只关心 POI 列表。
  //
  // 调用方提供 invoke 回调来决定具体调 search() 还是 searchNearby(...)，避免
  // 把两条路径的样板代码各写一份。
  //
  // 多关键字回调兼容：百度官方文档明确 search / searchInBounds / searchNearby
  // 的 keyword 都支持 String | Array（最多 10 个关键字，自 1.2 版本起）。
  // 调用方给单关键字时 onSearchComplete 收到的是单个 LocalResult；给数组时
  // 收到的是 LocalResult[]——这里统一归一化成数组迭代，让上层 invoke 回调
  // 决定传单还是数组，runLocalSearch 不需要分两条路径。
  //
  // 文档参考：https://lbsyun.baidu.com/cms/jsapi/reference/jsapi_webgl_1_0.html
  // 中 LocalSearch 章节："如果是多关键字范围检索，则返回一个 LocalResult 的数组"。
  private runLocalSearch(
    point: any,
    options: { forceLocal?: boolean; pageCapacity: number },
    invoke: (search: any) => void,
  ): Promise<POIItem[]> {
    const BMap = this.BMap;
    // LocalSearch 第一参数本身是 Point（不是 Map 实例），所以 service 路径
    // 完全不依赖 this.map——headless 模式下 this.map 为 null 仍然能用。
    if (!BMap) return Promise.resolve([]);
    return new Promise<POIItem[]>((resolve) => {
      const search = new BMap.LocalSearch(point, {
        ...options,
        onSearchComplete: (results: any) => {
          if (!results) {
            resolve([]);
            return;
          }
          const status =
            typeof search.getStatus === "function"
              ? search.getStatus()
              : BMAP_STATUS_SUCCESS;
          if (status !== BMAP_STATUS_SUCCESS) {
            resolve([]);
            return;
          }
          // 多关键字时 results = LocalResult[]，单关键字时 results = LocalResult。
          // 统一归一化成数组迭代——单 / 多关键字共用同一份 POI 提取逻辑。
          const localResults: any[] = Array.isArray(results)
            ? results
            : [results];
          const list: POIItem[] = [];
          for (const r of localResults) {
            if (!r) continue;
            const num =
              typeof r.getCurrentNumPois === "function"
                ? r.getCurrentNumPois()
                : 0;
            for (let i = 0; i < num; i++) {
              const item = normalizeBMapPOI(r.getPoi(i));
              if (item) list.push(item);
            }
          }
          resolve(list);
        },
      });
      invoke(search);
    });
  }

  // 跨城关键字检索：LocalSearch.search() + forceLocal: false。本城无命中时
  // SDK 自动扩展到全国（参见 searchByKeyword 头部注释）。
  private runLocalSearchKeyword(
    keyword: string,
    center: Coord,
    pageCapacity: number,
  ): Promise<POIItem[]> {
    const BMap = this.BMap;
    if (!BMap) return Promise.resolve([]);
    const point = new BMap.Point(center[0], center[1]);
    return this.runLocalSearch(
      point,
      { forceLocal: false, pageCapacity },
      (search) => search.search(keyword),
    );
  }

  // 周边检索：LocalSearch.searchNearby(keyword, point, radius)。受 radius 强约束，
  // 不会跨城（与 runLocalSearchKeyword 互补）。供 searchAround 的关键字分组调用。
  //
  // keyword 类型 string | string[]：
  //   - string：单关键字，对应 onSearchComplete(LocalResult)；
  //   - string[]：多关键字数组（**最多 10 个**，百度官方上限），对应
  //     onSearchComplete(LocalResult[])。runLocalSearch 已统一兼容两种回调。
  private runLocalSearchNearby(
    keyword: string | string[],
    center: Coord,
    radius: number,
    pageCapacity: number,
  ): Promise<POIItem[]> {
    const BMap = this.BMap;
    if (!BMap) return Promise.resolve([]);
    const point = new BMap.Point(center[0], center[1]);
    return this.runLocalSearch(point, { pageCapacity }, (search) =>
      search.searchNearby(keyword, point, radius),
    );
  }

  // 定位：BMapGL.Geolocation.getCurrentPosition（百度官方推荐方式）。
  //
  // 与原 `navigator.geolocation + BMapGL.Convertor` 两步式相比的优势：
  //   - **直接 BD09**：内部已做 WGS84 → BD09 转换，不需要再调 Convertor.translate，
  //     省一次异步 SDK 调用 + 配额；
  //   - **多源融合**：浏览器 H5 定位失败时自动 fallback 到 IP 定位（城市级），
  //     再失败才回 null——比 navigator.geolocation 的"成功 / 失败"二元结果
  //     更友好，用户拒绝 GPS 时仍能拿到城市级位置；
  //   - **状态码统一**：getStatus() 返回 BMAP_STATUS_SUCCESS / TIMEOUT /
  //     PERMISSION_DENIED / UNKNOWN_LOCATION，与 SDK 其他模块（LocalSearch
  //     等）的状态码语义一致。
  //
  // in-flight Promise 复用：连续调用共享同一个进行中的请求，避免重复弹权限框。
  // SDK 加载或实例创建失败的极端情况：返回 null（业务方按缺省定位处理）。
  //
  // 文档参考：
  //   https://lbs.baidu.com/docs/jsapi?title=jspopularGL/guide/geoloaction
  geolocate(options?: GeolocateOptions): Promise<Coord | null> {
    if (this.pendingGeolocate) return this.pendingGeolocate;

    const geolocation = this.geolocation;
    if (!geolocation || typeof geolocation.getCurrentPosition !== "function") {
      return Promise.resolve(null);
    }

    const allowIp = options?.allowIpFallback === true;

    const promise = new Promise<Coord | null>((resolve) => {
      geolocation.getCurrentPosition(
        function onComplete(this: any, r: any) {
          // SDK 设计：getStatus() 是 Geolocation 实例的方法（this 绑定到该实例）。
          // 用普通 function（非箭头函数）保留 this 引用，与百度官方示例一致。
          const status =
            typeof this?.getStatus === "function"
              ? this.getStatus()
              : BMAP_STATUS_SUCCESS;
          if (status !== BMAP_STATUS_SUCCESS || !r?.point) {
            console.warn(
              "[MapLocationSelection] BMapGL.Geolocation 失败。status=",
              status,
              "（6=PERMISSION_DENIED 2=POSITION_UNAVAILABLE 8=TIMEOUT）",
            );
            resolve(null);
            return;
          }
          const lng = Number(r.point.lng);
          const lat = Number(r.point.lat);
          if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
            resolve(null);
            return;
          }
          // IP 兜底事后判定：百度 GeolocationResult 不暴露 location_type，
          // 只能靠 accuracy 阈值识别。详见类内 IP_LOCATION_ACCURACY_THRESHOLD_M
          // 注释。
          const acc = Number(r.accuracy);
          const ipLike =
            Number.isFinite(acc) && acc >= IP_LOCATION_ACCURACY_THRESHOLD_M;
          if (!allowIp && ipLike) {
            console.warn(
              "[MapLocationSelection] BMapGL.Geolocation 命中 IP 兜底（accuracy=",
              r.accuracy,
              "m ≥",
              IP_LOCATION_ACCURACY_THRESHOLD_M,
              "m）但 allowIpFallback=false，已丢弃返回 null。",
            );
            resolve(null);
            return;
          }
          resolve([lng, lat]);
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

  // 反查：webservice `reverse_geocoding/v3` + jsonp 主路径，JSAPI fallback。
  //
  // 为何主路径不用 JSAPI（v5.3 切换原因）：
  //   - BMapGL JSAPI 类参考文档明确 `AddressComponent` 仅含 streetNumber /
  //     street / district / city / province 5 个字段，**不含 adcode**——所以
  //     业务方拿不到 6 位国标行政区划码。这与高德 JSAPI 端能直接拿到 adcode
  //     形成跛脚体验；
  //   - webservice `reverse_geocoding/v3` 的 `addressComponent` 包含 country /
  //     province / city / district / town / **adcode** (int) / street / 等
  //     完整字段，且与 JSAPI 共用同一个 ak（依赖 referer 白名单一致），用
  //     jsonp 在浏览器直调即可，**无需服务端代理**；
  //   - 每次只一发请求，比 JSAPI 主路径 + 二次补 adcode 更简洁、更省总耗时。
  //
  // JSAPI fallback 的价值：webservice 失败（断网 / 限额 / referer 拒绝）时
  // 仍能拿到 name / address / 省市区名称——只是 adcode 为 undefined，
  // splitAdcode 会让三个 *Code 同步置 undefined，业务方按需兜底。
  //
  // 文档参考：
  //   https://lbs.baidu.com/faq/api?title=webapi/guide/webservice-geocoding-abroad-base
  reverseGeocode(center: Coord): Promise<ReverseGeocodeResult | null> {
    return this.reverseGeocodeViaWebApi(center).then((webResult) => {
      if (webResult) return webResult;
      return this.reverseGeocodeViaJsapi(center);
    });
  }

  // webservice `reverse_geocoding/v3` 主路径。
  //
  // 字段映射（webservice → ReverseGeocodeResult）：
  //   * name 候选：sematic_description（"XX商圈附近"）→ business（商圈）→
  //     addressComponent.town（街道乡镇）→ addressComponent.street。**不掺
  //     POI**——POI 借用由 commitMapCenter 用 searchAround 的 LocalSearch
  //     fan-out 结果统一处理，与 JSAPI 路径口径一致；
  //   * address：formatted_address（"四川省成都市青羊区人民中路一段"，最规范）；
  //   * province / city / district：addressComponent 同名字段直拿；
  //   * adcode：addressComponent.adcode 是 **int**——toString() 后用 6 位 regex
  //     校验，非法返回 undefined。
  //
  // 失败语义（接口 status !== 0 或网络异常）：返回 null 让外层 fallback 到 JSAPI。
  private async reverseGeocodeViaWebApi(
    center: Coord,
  ): Promise<ReverseGeocodeResult | null> {
    const ak = this.opts.ak;
    if (!ak) return null;

    // location 参数顺序是 lat,lng（与 JSAPI 的 lng,lat 相反，百度文档明确）；
    // coordtype=bd09ll：与 BMapGL 全局坐标系对齐，避免内部再做 GCJ02→BD09 转换。
    const url =
      "https://api.map.baidu.com/reverse_geocoding/v3/?" +
      `ak=${encodeURIComponent(ak)}` +
      `&location=${center[1]},${center[0]}` +
      "&output=json" +
      "&coordtype=bd09ll" +
      "&extensions_poi=0";

    let raw: any;
    try {
      raw = await jsonp(url);
    } catch {
      // jsonp script onerror —— 在百度 webservice 的语义下几乎必然是 ak 鉴权
      // 失败：百度此时返回**未包装 callback 的纯 JSON 错误体**（如
      // `{"status":240,"message":"该 AK 不具备对应接口的权限..."}`），浏览器把
      // 它当 JS 解析触发 SyntaxError → script.onerror 抛 `Event{type:'error'}`。
      //
      // 给业务方一个**能直接定位问题**的诊断输出：把请求 url 打出来——开发者
      // 在浏览器新 tab 直接访问该 url，就能看到百度返回的真实 status/message。
      // 常见 status 码与对应处理：
      //   240 → 控制台「我的应用 → 设置 → 启用服务」勾选 "**Geocoding API**"
      //   210 → 「Referer 白名单」加当前域名（或填 `*` 临时放开）
      //   200 → ak 不存在 / 输入有误，复查 ak
      //   302 → 配额已用完（需付费或换 ak）
      console.warn(
        "[MapLocationSelection] BMap reverse_geocoding/v3 调用失败（adcode 取不到）。\n" +
          "原因通常是 ak 未启用 Geocoding API 服务、或 referer 白名单不含当前域名。\n" +
          "诊断步骤：\n" +
          "  1) 把下面这条 URL 复制到浏览器新 tab 打开，看百度返回的 status / message：\n" +
          "     " +
          url +
          "\n" +
          "  2) 去百度地图开放平台「我的应用 → 设置」给当前 ak 勾选 'Geocoding API'\n" +
          "     并把 Referer 白名单加上当前域名（或临时填 `*` 放开）。\n" +
          "组件已自动 fallback 到 JSAPI 路径，name/address/省市区名仍可用，仅 adcode=undefined。",
      );
      return null;
    }

    if (!raw || raw.status !== 0 || !raw.result) {
      // 这个分支：百度返回了**已包装 callback 的错误体**（少数情况），jsonp
      // 能正常解析为 JS 对象，但业务 status != 0。打印完整 status + message
      // 让业务方能直接看到原因，比 onerror 分支更"会说话"。
      if (raw?.status !== undefined) {
        console.warn(
          "[MapLocationSelection] reverse_geocoding/v3 业务错误（adcode 取不到，已 fallback 到 JSAPI）。\n" +
            "status=" +
            raw.status +
            " message=" +
            (raw.message || "") +
            "\n请求 URL：" +
            url,
        );
      }
      return null;
    }

    const result = raw.result;
    const ac = result.addressComponent || {};

    const business = (result.business ?? "").toString().trim();
    const firstBusiness = business
      ? business.split(/,|，/)[0]?.trim()
      : "";
    const sematicRaw = (result.sematic_description ?? "").toString().trim();
    const town = (ac.town ?? "").toString().trim();
    const street = (ac.street ?? "").toString().trim();
    const nameCandidates = [
      sematicRaw,
      firstBusiness,
      town,
      street,
    ];
    const name =
      nameCandidates
        .map((s) => (s ?? "").toString().trim())
        .find(Boolean) ?? "";

    const fullAddr = (result.formatted_address ?? "").toString().trim();
    // name / address 偶尔会一致（如同时 fallback 到 town），让 address 留空，
    // 与周边 POI 项「address 为空只渲染距离」的展示分支保持一致。
    const address = fullAddr === name ? "" : fullAddr;

    // adcode 是 int 类型（如 510105，不是字符串）。toString 后正则校验为 6 位
    // 数字才采纳，非法（极少数边境地区可能给 0 / 空）置 undefined 由上层兜底。
    const adcodeRaw = ac.adcode !== undefined ? String(ac.adcode).trim() : "";
    const adcode = /^\d{6}$/.test(adcodeRaw) ? adcodeRaw : undefined;

    return {
      name,
      address,
      province: ac.province,
      city: ac.city || ac.province,
      district: ac.district,
      adcode,
    };
  }

  // JSAPI fallback：webservice 失败时仍能拿到 name / address / 省市区名称。
  //
  // 关于 adcode：BMapGL JSAPI 类参考文档明确 AddressComponent 不含 adcode
  // 字段（详见头部 v5.3 注释），但**百度文档历来滞后于实现**，新版 SDK 的
  // result 上**可能**藏着 adcode（无法通过文档证实，只能运行时探测）。这里
  // 容错读取以下几个可能位置：
  //   1) result.addressComponents.adcode      （文档没列但最可能存在的位置）
  //   2) result.adcode                         （顶级，参考百度其他接口习惯）
  //   3) result.addressComponent.adcode        （单数形式 component，对齐 webservice）
  // 任意一个能拿到合法 6 位数字就采纳——比"硬编码 undefined"更稳健。
  //
  // 调试日志：webservice 失败时这条路径才会执行，**默认打印完整 result**——
  // 业务方在浏览器 console 能直接看到 BMapGL 返回的原始字段结构，协助识别
  // 是否真的有暗藏 adcode（如果发现某新版 SDK 真有，可在此处补字段名）。
  //
  // name 候选优先级：商圈[0] → 镇 → 街道（覆盖中心点的具体地名）。
  // 不掺 POI 名——POI 借用由 commitMapCenter 用 searchAround 的结果统一处理，
  // 跟高德端的对称（reverseGeocode 只负责"地名"，POI 列表走另一条路径）。
  private reverseGeocodeViaJsapi(
    center: Coord,
  ): Promise<ReverseGeocodeResult | null> {
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
          // 把完整 result 打出来，便于用户排查 BMapGL 是否藏了 adcode 字段。
          // 这条日志只在 webservice 主路径失败时才出现，不会污染正常调用。
          console.info(
            "[MapLocationSelection] BMapGL.Geocoder result（用于排查 adcode 字段）：",
            result,
          );
          const ac = result.addressComponents || {};
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
          // 多位置探测 adcode：万一新版 BMapGL 实际返回了，但文档没列。
          const adcodeCandidates: any[] = [
            ac.adcode,
            result.adcode,
            (result.addressComponent || {}).adcode,
          ];
          let adcode: string | undefined;
          for (const c of adcodeCandidates) {
            if (c === undefined || c === null) continue;
            const s = String(c).trim();
            if (/^\d{6}$/.test(s)) {
              adcode = s;
              break;
            }
          }
          resolve({
            name,
            address,
            province: ac.province,
            city: ac.city || ac.province,
            district: ac.district,
            adcode,
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
