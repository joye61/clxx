/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import ReactDOM from "react-dom";
import { Wrapper, AnimationStatus, WrapperProps } from "./Wrapper";
import { is } from "../utils/is";
import omit from "lodash/omit";

export interface DialogOption extends WrapperProps {
  // 弹框的内容
  content?: React.ReactNode;
  // 弹框被彻底关闭(关闭动画完成)时触发
  onClose?: () => void;
  // 是否开启空白处点击隐藏，默认开启
  canHideOnBlankClick?: boolean;
}

/**
 * 创建一个新的弹框对象，可以主动关闭
 */
export class Dialog {
  // 对话框的容器
  container: HTMLDivElement;
  // 对话框配置
  option: DialogOption = {
    type: "dialog",
    canHideOnBlankClick: true,
  };

  constructor(option?: React.ReactNode | DialogOption) {
    // 根据参数类型，获取选项配置
    if (React.isValidElement(option) || !is.isPlainObject(option)) {
      this.option.content = option;
    } else {
      this.option = { ...this.option, ...(option as DialogOption) };
    }

    // 首先渲染弹框
    this.container = document.createElement("div");
    document.body.appendChild(this.container);

    ReactDOM.render(this.createWrapper("show"), this.container);
  }

  // 关闭回调的便捷方法
  onClose(callback: () => void) {
    this.option.onClose = callback;
  }

  /**
   * 根据动画创建弹框
   * @param animationStatus
   */
  createWrapper(animationStatus: AnimationStatus) {
    const props = omit(this.option, ["content", "onClose"]);
    props.animationStatus = animationStatus;
    props.onHide = () => {
      ReactDOM.unmountComponentAtNode(this.container);
      this.container.remove();
      this.option.onClose?.();
    };
    // 显示状态主动添加关闭监听
    if (this.option.canHideOnBlankClick && animationStatus === "show") {
      props.onMaskClick = () => {
        this.close();
      };
    }
    return <Wrapper {...props}>{this.option.content}</Wrapper>;
  }

  /**
   * 主动调用以动画形式收起弹框，并且关闭它
   */
  close() {
    // 主动调用一个组件的方式是向它传递属性
    ReactDOM.render(this.createWrapper("hide"), this.container);
  }
}
