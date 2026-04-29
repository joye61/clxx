import { showMapLocationSelection } from "@";

const AMAP_KEY = "9e93b7084bb3da8d2094c02dc4221d47";
// JSAPI v2.0 调用 PlaceSearch / Geocoder / AutoComplete 等服务类接口必须配置安全密钥
const AMAP_SECURITY_JS_CODE = "d57bb5e049555d04e0dabcd7557ce5e2";

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
            onSelect: (loc) => {
              console.log("选择了位置：", loc);
              alert(
                `已选择：${loc.name || "(无名称)"}\n地址：${loc.address}\n经纬度：${loc.longitude.toFixed(6)}, ${loc.latitude.toFixed(6)}`,
              );
            },
            onClose: () => {
              console.log("关闭了地图选址");
            },
          });
        }}
      >
        打开地图选址
      </button>

      <button
        onClick={() => {
          showMapLocationSelection({
            amapKey: AMAP_KEY,
            securityJsCode: AMAP_SECURITY_JS_CODE,
            initialCity: "上海",
            initialCenter: [121.473667, 31.230525],
            primary: "#07c160",
            onSelect: (loc) => {
              console.log("选择了位置：", loc);
            },
          });
        }}
      >
        打开地图选址（上海，绿色主题）
      </button>
    </div>
  );
}
