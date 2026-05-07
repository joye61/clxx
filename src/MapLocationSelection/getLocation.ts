// 独立的函数式定位 API：不挂组件直接拿到一份 SelectedLocation。
//
// 与 MapLocationSelection 组件的关系：
//   * 组件 = 「打开地图 → 用户拖图选位置 → 点确定 → onSelect」交互式流程；
//   * getLocation = 「直接拿一份当前 GPS 位置的 SelectedLocation」无 UI 流程。
//
// 数据格式与组件 onSelect 完全一致——两边都通过 buildSelectedLocation 这同
// 一个 helper 拼装，**不可能出现字段差异**。业务方拿 getLocation 的返回值
// 与拿组件的 onSelect 回调可以走同一条业务处理路径。
//
// 内部依赖：
//   * createProvider：与组件复用同一份配置校验（amapKey / bmapAk 必填检查）；
//   * provider.initHeadless：**仅加载 SDK + 创建 service 类，不创建 Map 实例**——
//     不挂 DOM、不下载瓦片、不渲染。SDK 的 Geolocation / Geocoder /
//     PlaceSearch / LocalSearch 这几个 service 类**本身就独立于 Map**（高德
//     官方示例直接 new AMap.Geolocation()、百度 LocalSearch 文档明示第一参数
//     可传 Point/city 而非 Map），所以走 headless 是 SDK 设计支持的，不是 hack；
//   * provider.geolocate：拿 GPS 经纬度（去抖、坐标系自洽、IP 兜底过滤）；
//   * provider.reverseGeocode：拿省市区 + 详细地址 + adcode；
//   * provider.searchAround：拿周边 POI（用于 nearestPoi 兜底，避免名字
//     fallback 到"街道镇"粗粒度）；
//   * buildSelectedLocation：与组件 handleConfirm 共用的拼装逻辑。

import { buildSelectedLocation } from "./buildSelectedLocation";
import {
  createProvider,
  type CreateProviderOptions,
} from "./createProvider";
import type { MapProvider } from "./provider";
import { haversineMeters, type SelectedLocation } from "./types";

export interface GetLocationOptions extends CreateProviderOptions {
  // 整体超时（毫秒），默认 15000。覆盖 SDK 加载 + 定位 + 反查 + 周边搜索
  // 全链路。15s 是经验值：移动端 4G 下 SDK 加载 1-3s + GPS 定位 1-5s +
  // 反查/周边并行 0.5-2s ≈ 上限 10s，留 5s 余量兜住偶发慢网络。
  timeout?: number;
  // initialCity：透传给 provider 的 PlaceSearch / LocalSearch 城市约束，
  // 影响周边搜索的本地化效果。**通常不需要传**——getLocation 主要场景是
  // "拿 GPS 真实位置"，搜索作用域由 GPS 经纬度自动推导出所属城市。
  initialCity?: string;
  // 是否允许「IP 定位兜底」。默认 false。
  //
  // - **false（默认）**：浏览器 H5 定位失败时直接抛 Error，业务方按"定位
  //   失败"处理。适合打车 / 外卖等"必须拿到精确位置"的业务；
  // - **true**：H5 失败时接受 SDK 自动 fallback 的 IP 定位结果（城市级，
  //   accuracy 通常 ≥ 5000m），适合"有大致位置就行"的城市级业务。
  //
  // 详细判定规则见 GeolocateOptions 与各 provider 的 isIp* 工具函数。
  allowIpFallback?: boolean;
}

export async function getLocation(
  options: GetLocationOptions = {},
): Promise<SelectedLocation> {
  const timeout = options.timeout ?? 15000;

  let provider: MapProvider | null = null;
  let timer: number | null = null;

  try {
    // createProvider 内置必填字段校验（amapKey / bmapAk 缺失立即抛 Error）。
    provider = createProvider(options);

    const work = runGetLocation(provider, options);

    if (timeout > 0 && Number.isFinite(timeout)) {
      const timeoutPromise = new Promise<never>((_, reject) => {
        timer = window.setTimeout(() => {
          reject(new Error(`[getLocation] 超时（${timeout}ms）`));
        }, timeout);
      });
      return await Promise.race([work, timeoutPromise]);
    }

    return await work;
  } finally {
    if (timer !== null) {
      window.clearTimeout(timer);
      timer = null;
    }
    if (provider) {
      try {
        provider.destroy();
      } catch {
        // ignore
      }
    }
  }
}

// 真正的工作流。拆出来的目的：让 getLocation 的 try/finally 只负责资源
// 清理，业务流程在这里更清晰，且方便 Promise.race 包装超时。
async function runGetLocation(
  provider: MapProvider,
  options: GetLocationOptions,
): Promise<SelectedLocation> {
  // headless 模式：仅加载 SDK + 创建 service 类，不创建 Map 实例。
  // 详见 provider.initHeadless 接口注释——节省 ~5-10 个瓦片请求 +
  // ~100-300ms 渲染开销，无需挂任何 DOM 容器。
  await provider.initHeadless({ initialCity: options.initialCity });

  const pos = await provider.geolocate({
    allowIpFallback: options.allowIpFallback,
  });
  if (!pos) {
    throw new Error(
      "[getLocation] 定位失败：用户拒绝授权 / 浏览器不支持 GPS / 非 https 环境" +
        (options.allowIpFallback
          ? ""
          : "（如需接受 IP 兜底定位，请传 allowIpFallback: true）"),
    );
  }

  // 反查 + 周边搜索并行——总耗时 ≈ max(reverseGeocode, searchAround)，
  // 而非串行 sum。两者互不依赖，并行是无成本的体感优化。
  // 周边搜索的目的：拿到 nearestPoi 兜底 name——与组件 handleConfirm 在
  // 「未点列表 + 点确定」分支的兜底链一致（详见 buildSelectedLocation 的
  // pickedPoi / candidatePoi 注释）。
  // pageSize=20 / radius=200 与组件默认值对齐，行为完全等价。
  const [geo, around] = await Promise.all([
    provider.reverseGeocode(pos).catch(() => null),
    provider
      .searchAround(pos, { page: 1, pageSize: 20, radius: 200 })
      .catch(() => ({ pois: [], hasMore: false })),
  ]);

  // candidatePoi 的 distance 字段口径：组件 UI 层通过 rewriteDistanceFromCenter
  // 在 commit 时把 SDK 自带 distance 重写为「POI ↔ centerPin」（haversine 重算）。
  // getLocation 没有 UI commit 路径，但 buildSelectedLocation 用 distance 字段
  // 判断「是否在 80m 兜底阈值内」——必须保证口径一致，所以这里手动重算一次。
  const top = around.pois[0];
  const candidatePoi = top
    ? {
        ...top,
        distance: haversineMeters(
          pos[0],
          pos[1],
          top.location.lng,
          top.location.lat,
        ),
      }
    : null;

  return buildSelectedLocation(pos, geo, { candidatePoi });
}
