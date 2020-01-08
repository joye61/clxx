import "./index.scss";
import React from "react";
import { RollingNotice } from "../../../packages/rolling-notice/build";

export default function() {
  return (
    <div>
      <div>
        <p>1、常规冒泡动画滚动公告，纯文本公告内容，自动无限循环</p>
        <RollingNotice
          style={{ border: "1px solid gray" }}
          height=".36rem"
          list={[
            "这是第一条滚动公告",
            "这是第二条滚动公告，这条要长很多多多多多多多多多",
            "这是第三条滚动公告",
            "这是第四条滚动公告"
          ]}
        />
      </div>
      <div>
        <p>2、可以通过react组件任意定制条目的内容</p>
        <RollingNotice
          style={{ border: "1px solid gray" }}
          height=".36rem"
          list={[
            <div className="RollingNoticeItem">这是第一条滚动公告</div>,
            <div className="RollingNoticeItem RollingNoticeItemActive">
              这是第二条滚动公告，这条要长很多多多多多多多多多
            </div>,
            <div className="RollingNoticeItem">这是第三条滚动公告</div>,
            <div className="RollingNoticeItem">有个小按钮<button>我是按钮</button></div>
          ]}
        />
      </div>
    </div>
  );
}
