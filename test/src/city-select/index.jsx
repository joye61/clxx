import { showCitySelect } from "@";

export default function Index() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", padding: "0.3rem" }}>
      <button
        onClick={() => {
          showCitySelect({
            onSelect: (city) => {
              console.log("选择了城市：", city);
            },
            getLocation() {
              return "北京";
            },
          });
        }}
      >
        选择城市（默认：不含港澳台）
      </button>
      <button
        onClick={() => {
          showCitySelect({
            taiwanHKMacau: true,
            onSelect: (city) => {
              console.log("选择了城市：", city);
            },
          });
        }}
      >
        选择城市（含港澳台）
      </button>
    </div>
  );
}
