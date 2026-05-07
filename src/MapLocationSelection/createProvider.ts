// MapProvider 工厂：根据配置选择 amap / bmap 实现并校验必传字段。
//
// 抽出位置：原本内联在 index.tsx 的 createProvider，因为 getLocation
// （独立的纯函数式定位 API，见 getLocation.ts）也需要相同的 provider
// 创建逻辑——避免「UI 走 amap / 函数式调用走 amap」两条路径出现配置
// 校验差异（一边漏校 securityJsCode、一边漏报 ak 缺失等）。
//
// CreateProviderOptions 也是 MapLocationSelectionProps / GetLocationOptions
// 的最小公共子集——两边都通过 extends 承接这组字段，调用方传一次配置即可。

import type { MapProvider, MapProviderType } from "./provider";
import { AMapProvider } from "./provider.amap";
import { BMapProvider } from "./provider.bmap";

export interface CreateProviderOptions {
  // 选择地图实现，默认 "amap"。"amap" 必须传 amapKey；"bmap" 必须传 bmapAk。
  provider?: MapProviderType;
  // 高德 Web 端 Key（provider="amap" 时必填）
  amapKey?: string;
  // 高德安全密钥（生产建议使用代理 serviceHost）
  securityJsCode?: string;
  // 百度 Web 端 ak（provider="bmap" 时必填）
  bmapAk?: string;
}

export function createProvider(opts: CreateProviderOptions): MapProvider {
  const type = opts.provider ?? "amap";
  if (type === "bmap") {
    if (!opts.bmapAk) {
      throw new Error("[MapLocationSelection] provider=bmap 时 bmapAk 必填");
    }
    return new BMapProvider({
      ak: opts.bmapAk,
    });
  }
  if (!opts.amapKey) {
    throw new Error("[MapLocationSelection] provider=amap 时 amapKey 必填");
  }
  return new AMapProvider({
    amapKey: opts.amapKey,
    securityJsCode: opts.securityJsCode,
  });
}
