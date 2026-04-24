import { showCitySelect } from "@";
import { useEffect } from "react";

export default function Index() {
  return (
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
      选择城市
    </button>
  );
}
