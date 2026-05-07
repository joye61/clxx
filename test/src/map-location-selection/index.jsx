import { showMapLocationSelection, getLocation } from "@";

const AMAP_KEY = "9e93b7084bb3da8d2094c02dc4221d47";
// JSAPI v2.0 调用 PlaceSearch / Geocoder / AutoComplete 等服务类接口必须配置安全密钥
const AMAP_SECURITY_JS_CODE = "d57bb5e049555d04e0dabcd7557ce5e2";

const BMAP_AK = "YS5En8FGCXQnAt65nAXn5LOUP5ANRRQy";

const reportSelected = (loc) => {
  console.log("选择了位置：", loc);
  const region = [loc.province, loc.city, loc.district]
    .filter(Boolean)
    .join(" / ");
  const codes = [loc.provinceCode, loc.cityCode, loc.districtCode]
    .filter(Boolean)
    .join(" / ");
  alert(
    `已选择：${loc.name || "(无名称)"}\n` +
      `地址：${loc.address}\n` +
      `经纬度：${loc.longitude.toFixed(6)}, ${loc.latitude.toFixed(6)}\n` +
      `行政区划：${region || "(未返回)"}\n` +
      `行政区划码：${codes || "(未返回)"}`,
  );
};

// 调用函数式 getLocation，返回值与组件 onSelect 完全同结构（共享
// buildSelectedLocation 拼装），用 reportSelected 弹同样的展示框。
const reportError = (err) => {
  console.error("getLocation 失败：", err);
  alert(`定位失败：${err?.message || err}`);
};

export default function Index() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.2rem",
        padding: "0.3rem",
      }}
    >
      <button
        onClick={() => {
          showMapLocationSelection({
            amapKey: AMAP_KEY,
            securityJsCode: AMAP_SECURITY_JS_CODE,
            onSelect: reportSelected,
            onClose: () => {
              console.log("关闭了地图选址（高德）");
            },
          });
        }} 
      >
        打开地图选址（高德）
      </button>

      <button
        onClick={() => {
          showMapLocationSelection({
            amapKey: AMAP_KEY,
            securityJsCode: AMAP_SECURITY_JS_CODE,
            initialCity: "上海",
            // GCJ02 上海人民广场
            initialCenter: [121.473667, 31.230525],
            primary: "#07c160",
            onSelect: reportSelected,
          });
        }}
      >
        打开地图选址（高德 - 上海，绿色主题）
      </button>

      <button
        onClick={() => {
          showMapLocationSelection({
            provider: "bmap",
            bmapAk: BMAP_AK,
            onSelect: reportSelected,
            onClose: () => {
              console.log("关闭了地图选址（百度）");
            },
          });
        }}
      >
        打开地图选址（百度）
      </button>

      <button
        onClick={() => {
          showMapLocationSelection({
            provider: "bmap",
            bmapAk: BMAP_AK,
            // BD09 上海人民广场
            initialCenter: [121.479675, 31.236397],
            primary: "#07c160",
            onSelect: reportSelected,
          });
        }}
      >
        打开地图选址（百度 - 上海，绿色主题）
      </button>

      {/* 函数式 getLocation：不弹窗、直接拿一份 SelectedLocation。
          数据格式与上方 reportSelected 完全一致，复用同一个展示弹框。 */}
      <button
        onClick={() => {
          getLocation({
            amapKey: AMAP_KEY,
            securityJsCode: AMAP_SECURITY_JS_CODE,
          })
            .then(reportSelected)
            .catch(reportError);
        }}
      >
        getLocation（高德 - 默认，禁用 IP 兜底）
      </button>

      <button
        onClick={() => {
          getLocation({
            amapKey: AMAP_KEY,
            securityJsCode: AMAP_SECURITY_JS_CODE,
            allowIpFallback: true,
          })
            .then(reportSelected)
            .catch(reportError);
        }}
      >
        getLocation（高德 - 允许 IP 兜底）
      </button>

      <button
        onClick={() => {
          getLocation({
            provider: "bmap",
            bmapAk: BMAP_AK,
          })
            .then(reportSelected)
            .catch(reportError);
        }}
      >
        getLocation（百度 - 默认，禁用 IP 兜底）
      </button>

      <button
        onClick={() => {
          getLocation({
            provider: "bmap",
            bmapAk: BMAP_AK,
            allowIpFallback: true,
          })
            .then(reportSelected)
            .catch(reportError);
        }}
      >
        getLocation（百度 - 允许 IP 兜底）
      </button>

      {/* 组件入口的 IP 兜底测试：在 H5 GPS 失败 / 拒绝授权 / 室内信号差时，
          高德 / 百度 SDK 内部默认会自动 IP 定位（城市级精度，accuracy 通常
          ≥ 5000m）。组件默认丢弃 IP 结果（allowIpFallback=false）→ 回到
          fallback 中心；传 allowIpFallback=true 后接受 IP 结果 → 列表展示
          city 级附近。 */}
      <button
        onClick={() => {
          showMapLocationSelection({
            amapKey: AMAP_KEY,
            securityJsCode: AMAP_SECURITY_JS_CODE,
            allowIpFallback: true,
            onSelect: reportSelected,
          });
        }}
      >
        打开地图选址（高德 - 允许 IP 兜底）
      </button>

      <button
        onClick={() => {
          showMapLocationSelection({
            provider: "bmap",
            bmapAk: BMAP_AK,
            allowIpFallback: true,
            onSelect: reportSelected,
          });
        }}
      >
        打开地图选址（百度 - 允许 IP 兜底）
      </button>
    </div>
  );
}
