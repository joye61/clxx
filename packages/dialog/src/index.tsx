/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import ReactDOM from "react-dom";
import { DialogWrapper, DialogType } from "./DialogWrapper";

/**
 * 创建一个新的弹框对象，可以主动关闭
 */
export class Dialog {
  container: HTMLDivElement;
  constructor(
    public content?: React.ReactNode,
    public type: DialogType = "dialog"
  ) {
    this.container = document.createElement("div");
    document.body.appendChild(this.container);
    ReactDOM.render(
      <DialogWrapper type={type} animation="show">
        {content}
      </DialogWrapper>,
      this.container
    );
  }

  /**
   * 主动调用以动画形式收起弹框，并且关闭它
   */
  close() {
		// 主动调用一个组件的方式是向它传递属性
    ReactDOM.render(
      <DialogWrapper
        type={this.type}
        animation="hide"
        onHide={() => {
          ReactDOM.unmountComponentAtNode(this.container);
          this.container.remove();
        }}
      >
        {this.content}
      </DialogWrapper>,
      this.container
    );
  }
}
