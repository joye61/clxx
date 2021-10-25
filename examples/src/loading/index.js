import React from "react";
import { showLoading, showLoadingAtLeast } from "@";

export default function Index () {
  return (
    <div>
      <p>普通加载(5秒后自动关闭)</p>
      <button
        onClick={async () => {
          const close = await showLoading();
          window.setTimeout(close, 5000);
        }}
      >
        显示Loading
      </button>
      <p>普通加载带提示文字(5秒后自动关闭)</p>
      <button
        onClick={async () => {
          const close = await showLoading("数据加载中...");
          window.setTimeout(close, 5000);
        }}
      >
        显示Loading
      </button>
      <p>至少展示2000毫秒</p>
      <button
        onClick={async () => {
          const close = await showLoadingAtLeast(2000);
          await close();
        }}
      >
        显示Loading
      </button>
    </div>
  );
}
