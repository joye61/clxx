// 把 reverseGeocode 结果 + 候选 POI 拼装成对外的 SelectedLocation。
//
// 单一信源：MapLocationSelection 组件的「确定按钮 onSelect」、列表头部
// 「当前位置」虚拟项、独立的 `getLocation()` 函数式 API 全部走这里。
// 之前 handleConfirm 与 currentItem useMemo 各自维护一份逐字对齐的内联
// 实现（用注释「STAY-IN-SYNC 双源同步」标注），任何一边改动都得手动同步
// 另一边——抽到这里后变成单点维护，从根源上消除「列表第一条显示什么 ≠
// 确定后提交什么」的体感错位风险。

import { type POIItem, type SelectedLocation } from "./types";
import type { ReverseGeocodeResult } from "./provider";

// nearestPoi 的距离阈值：80m 覆盖典型楼栋 / 出入口 / 地铁站口的
// 距离半径，再远就不能代表「用户在地图上选的那个位置」。
//
// 用途：当用户没主动点列表项时，借 poiList[0]（最近 POI）的 name / address
// 作为兜底——避免高德 / 百度 reverseGeocode 在没楼宇位置 fallback 到
// township 粗粒度的"陆家嘴街道""高桥镇"之类。
export const NEAREST_POI_FALLBACK_RADIUS_M = 80;

// 国标 GB/T 2260 编码切分：6 位 adcode → 省（前 2 + "0000"）/ 市（前 4
// + "00"）/ 区（完整 6 位）。
//
// SDK 直接给 6 位 adcode（高德 r.addressComponent.adcode、百度
// result.addressComponents.adcode），切分一次就能得到三层 code，**完全
// 不需要外部映射表**（如 RegionPicker/data.ts）。
//
// Corner case：
//   - 不设区的地级市（东莞 441900、中山 442000、嘉峪关 620200 等）：
//     cityCode === districtCode，是国标允许的预期结果；
//   - 直辖市：cityCode 是市辖区码（如 110100），不是 110000；provinceCode
//     才是 110000；
//   - 输入非法（undefined / 不是 6 位数字）：返回 undefined，由调用方把
//     三个 *Code 字段都置 undefined。
export function splitAdcode(adcode?: string):
  | {
      provinceCode: string;
      cityCode: string;
      districtCode: string;
    }
  | undefined {
  if (!adcode || !/^\d{6}$/.test(adcode)) return undefined;
  return {
    provinceCode: `${adcode.slice(0, 2)}0000`,
    cityCode: `${adcode.slice(0, 4)}00`,
    districtCode: adcode,
  };
}

export interface BuildSelectedLocationOptions {
  // 用户「主动点列表项」时传入的 POI（最高优先级 name 来源）。
  // POI 名通常是「楼栋 / 商铺 / 出入口」级别，比 reverseGeocode 给的
  // 「街道+门牌」对司机 / 配送员更友好。
  // 走「未点列表 + 直接确定」分支时传 undefined。
  pickedPoi?: { name?: string; address?: string };
  // 候选 POI（一般是 poiList[0] / searchAround 结果首项）。当 pickedPoi
  // 为空且 candidatePoi.distance ≤ NEAREST_POI_FALLBACK_RADIUS_M 时，
  // 用作 name / address 兜底——见上方 NEAREST_POI_FALLBACK_RADIUS_M 注释。
  candidatePoi?: POIItem | null;
}

// 拼装优先级链（与原 handleConfirm 内联实现 1:1 等价）：
//
//   * name：pickedPoi.name → nearestPoi.name → geo.name → 行政区划兜底
//          → 经纬度兜底。POI 名（楼栋/商铺级）放在最前。
//   * address：geo.address → nearestPoi.address → pickedPoi.address →
//             行政区划文本兜底 → 经纬度兜底。geo.address 缺省市区前缀
//             时（如只有"中山路 100 号"）自动在前面拼接 adminText。
//   * province / city / district：永远以 geo 为准（POI 经常缺这些字段）。
//   * provinceCode / cityCode / districtCode：geo.adcode 切分（splitAdcode）。
//
// 兜底链最尾端（reverseGeocode 彻底失败 + 无 POI 兜底）：用经纬度字符串
// 拼接，保证 name + address 永远不为空，业务方拿到的数据永远可读。
//
// 行政区划文本拼接的去重：直辖市 city === province 时只保留省名，避免
// 出现"上海市上海市浦东新区"这种重复。
export function buildSelectedLocation(
  center: [number, number],
  geo: ReverseGeocodeResult | null,
  options: BuildSelectedLocationOptions = {},
): SelectedLocation {
  const { pickedPoi, candidatePoi } = options;

  let nearestPoi: POIItem | null = null;
  if (!pickedPoi && candidatePoi) {
    if (
      typeof candidatePoi.distance === "number" &&
      candidatePoi.distance <= NEAREST_POI_FALLBACK_RADIUS_M
    ) {
      nearestPoi = candidatePoi;
    }
  }
  const nearestPoiName = nearestPoi?.name?.trim() || "";
  const nearestPoiAddress = nearestPoi?.address?.trim() || "";

  let name =
    pickedPoi?.name?.trim() ||
    nearestPoiName ||
    geo?.name?.trim() ||
    "";

  let address =
    geo?.address?.trim() ||
    nearestPoiAddress ||
    pickedPoi?.address?.trim() ||
    "";

  const province = geo?.province?.trim() || undefined;
  const city = geo?.city?.trim() || undefined;
  const district = geo?.district?.trim() || undefined;

  const adminText = [
    province,
    city && city !== province ? city : "",
    district,
  ]
    .filter((s): s is string => !!s && s.length > 0)
    .join("");

  if (!address) {
    address =
      adminText ||
      `经纬度 ${center[0].toFixed(6)},${center[1].toFixed(6)}`;
  } else if (
    adminText &&
    !address.startsWith(adminText) &&
    !address.includes(adminText)
  ) {
    // address 已有但缺省市区前缀（如只返回"中山路 100 号"）→ 在前面补"省市区"，
    // 例如：上海市浦东新区 + 中山路 100 号 = "上海市浦东新区中山路 100 号"。
    // 双重检查 startsWith / includes：高德 formattedAddress 有时已经内嵌
    // 省市区前缀，这时不能重复拼接。
    address = `${adminText}${address}`;
  }

  if (!name) {
    name =
      district ||
      city ||
      province ||
      `位置 ${center[0].toFixed(6)},${center[1].toFixed(6)}`;
  }

  const codes = splitAdcode(geo?.adcode);

  return {
    name,
    address,
    longitude: center[0],
    latitude: center[1],
    city,
    province,
    district,
    provinceCode: codes?.provinceCode,
    cityCode: codes?.cityCode,
    districtCode: codes?.districtCode,
  };
}
