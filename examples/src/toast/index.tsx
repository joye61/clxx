import React from "react";
import { showToast } from "../../../packages/toast";

export default function() {
  return (
    <div>
      <div>
        <p>1、屏幕上方显示Toast</p>
        <button
          onClick={() => {
            showToast({
              content: "屏幕上方显示Toast",
              position: "top"
            });
          }}
        >
          屏幕上方显示Toast
        </button>
      </div>
      <div>
        <p>2、屏幕下方显示Toast</p>
        <button
          onClick={() => {
            showToast({
              content: "屏幕下方显示Toast",
              position: "bottom"
            });
          }}
        >
          屏幕下方显示Toast
        </button>
      </div>
      <div>
        <p>3、屏幕中间显示Toast</p>
        <button
          onClick={() => {
            showToast("屏幕中间显示Toast");
          }}
        >
          屏幕中间显示Toast
        </button>
      </div>
      <div>
        <p>4、显示直角Toast</p>
        <button
          onClick={() => {
            showToast({
              content: "显示直角Toast",
              rounded: false
            });
          }}
        >
          显示直角Toast
        </button>
      </div>
    </div>
  );
}
