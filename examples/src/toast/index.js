import React from "react";
import { showToast, showUniqToast } from "@";

export default function () {
  return (
    <div>
      <p>toast内容为纯文本</p>
      <button
        onClick={() => {
          showToast("一个简单的Toast轻提示");
        }}
      >
        显示Toast
      </button>

      <p>toast内容为可定制组件</p>
      <button
        onClick={() => {
          showToast(
            <div style={{ border: "1px solid red", background: "green" }}>
              一个简单的<span style={{ color: "red" }}>Toast</span>轻提示
            </div>
          );
        }}
      >
        显示Toast
      </button>

      <p>toast内容在顶部显示</p>
      <button
        onClick={() => {
          showToast({
            content: "抱歉，发生了很多错误",
            position: "top",
          });
        }}
      >
        显示Toast
      </button>

      <p>toast内容在底部显示</p>
      <button
        onClick={() => {
          showToast({
            content: "一个简单的Toast轻提示Toast轻提示Toast轻提示Toast轻提示",
            position: "bottom",
          });
        }}
      >
        显示Toast
      </button>

      <p>内容非常长的Toast</p>
      <button
        onClick={() => {
          showToast(
            "这是一个内容非常长的提示，你看看它的内容到底有多么的长，长度超出屏幕的宽度"
          );
        }}
      >
        显示Toast
      </button>

      <p>全局唯一的Toast</p>
      <button
        onClick={() => {
          showUniqToast("全局唯一的Toast");
        }}
      >
        显示Toast
      </button>
      <p>全局唯一的Toast,永不消失</p>
      <button
        onClick={() => {
          showUniqToast({
            content: "全局唯一的Toast顶部",
            position: "top",
            duration: 10000000
          });
        }}
      >
        显示Toast
      </button>
    </div>
  );
}
