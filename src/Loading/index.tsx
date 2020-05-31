/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import ReactDOM from "react-dom";
import { Wrapper, LoadingWrapperProps } from "./Wrapper";
import { is } from "../utils/is";
import omit from "lodash/omit";

export interface LoadingOption extends LoadingWrapperProps {
  // loading最小持续时间，默认为1000毫秒
  minDuration?: number;
}

export class Loading {
  // 当前是否正在显示0：否，1：是
  state: 0 | 1 = 0;

  // 当前loading的容器
  container?: HTMLDivElement;

  // 配置对象
  config: LoadingOption = {
    minDuration: 0,
  };

  // 容器的属性
  wrapperProps: LoadingWrapperProps;

  // 开始显示的时间
  startShowTime = 0;

  constructor(option: React.ReactNode | LoadingOption) {
    // 解析配置文件
    const optionIsObject = is.isPlainObject(option);
    if (React.isValidElement(option) || !optionIsObject) {
      this.config.extra = option;
    } else if (optionIsObject) {
      this.config = { ...this.config, ...(option as LoadingOption) };
    }

    // 获取传递给容器的属性
    this.wrapperProps = omit(this.config, ["minDuration"]);

    // 显示loading
    this.show();
  }

  show() {
    if (this.state === 1) {
      return;
    }
    // 设置状态为显示
    this.state = 1;
    // 设置开始显示的时间
    this.startShowTime = Date.now();

    if (!this.container) {
      this.container = document.createElement("div");
      document.body.appendChild(this.container);
    }
    this.wrapperProps.state = "show";
    ReactDOM.render(<Wrapper {...this.wrapperProps} />, this.container!);
  }

  /**
   * 关闭loading，因为可能有最小显示时间，所以为异步
   */
  async close() {
    if (this.container && this.state === 1) {
      const current = Date.now();
      // 当前关闭触发时已经持续的时间
      const continuedTime = current - this.startShowTime;

      // 如果关闭时还未达到设置的最小持续时间，则继续等待
      if (continuedTime < this.config.minDuration!) {
        const left = this.config.minDuration! - continuedTime;
        await new Promise((resolve) => {
          window.setTimeout(() => {
            resolve();
          }, left);
        });
      }

      // 时间已经达到了，开始关闭
      this.wrapperProps.state = "hide";
      this.wrapperProps.onHide = () => {
        ReactDOM.unmountComponentAtNode(this.container!);
        this.container!.remove();
        this.container = undefined;
        this.state = 0;
      };
      ReactDOM.render(<Wrapper {...this.wrapperProps} />, this.container);
    }
  }
}
