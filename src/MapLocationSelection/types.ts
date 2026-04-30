// ===== 与具体地图 SDK 解耦的共享类型 =====
//
// 设计原则：
//   - UI 层（index.tsx）只看到这里的类型，不直接依赖 AMap / BMapGL；
//   - 各 provider 内部把 SDK 原始数据映射成 POIItem 后再返回；
//   - Coord 不约束坐标系：高德 provider 内部用 GCJ02，百度 provider 内部用 BD09，
//     两者只与「自己」交互，UI 把数字透传给业务方即可。

export type Coord = [number, number]; // [lng, lat]

export interface POIItem {
  id: string;
  name: string;
  address: string;
  location: { lng: number; lat: number };
  cityname?: string;
  pname?: string;
  adname?: string;
  // 米数距离。语义说明：
  //   - provider 层产出的 distance 是「POI ↔ 当前搜索中心（地图中心）」的接口/兜底值；
  //   - UI 层（index.tsx）拿到结果后，若已经定位到用户真实位置，会**统一覆盖**为
  //     「POI ↔ 用户真实位置」 —— 与微信 / 高德 App / 滴滴的展示口径一致。
  distance?: number;
  // 原始 SDK POI 对象，回调给业务方时用
  raw: any;
}

// 选中地址的统一结构（对外回调）
export interface SelectedLocation {
  // POI 名称或逆地理结构化标题
  name: string;
  // 详细地址
  address: string;
  // 经度、纬度（坐标系与所选 provider 一致：amap=GCJ02、bmap=BD09）
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

// 球面距离（米）。两点都是同一坐标系下的经纬度即可——
// BD09 / GCJ02 / WGS84 在小尺度（< 数十公里）下半径误差可忽略。
export function haversineMeters(
  lng1: number,
  lat1: number,
  lng2: number,
  lat2: number,
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
