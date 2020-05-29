/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { Wrapper, DialogType, AnimationStatus } from './Wrapper';
import { FixContainerProps } from '../Layout/FixContainer';
import { is } from '../utils/is';

export interface DialogOption {
  type?: DialogType;
  content?: React.ReactNode;
  renderContent?: (instance: Dialog) => React.ReactNode;
  maskOption?: FixContainerProps;
  onClose?: () => void;
  animationDuration?: number | string;
  id?: string;
  className?: string;
}

/**
 * 创建一个新的弹框对象，可以主动关闭
 */
export class Dialog {
  // 对话框的容器
  container: HTMLDivElement;
  //
  option: DialogOption = {
    type: 'dialog',
  };

  constructor(option?: React.ReactNode | DialogOption) {
    // 根据参数类型，获取选项配置
    if (React.isValidElement(option) || !is.isPlainObject(option)) {
      this.option.content = option;
    } else {
      this.option = { ...this.option, ...(option as DialogOption) };
    }

    // 首先渲染弹框
    this.container = document.createElement('div');
    document.body.appendChild(this.container);

    // 设置id和class
    if (this.option.id) {
      this.container.id = this.option.id;
    }
    if (this.option.className) {
      this.container.className = this.option.className;
    }

    ReactDOM.render(this.createWrapper('show'), this.container);
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
    return (
      <Wrapper
        type={this.option.type}
        animationStatus={animationStatus}
        animationDuration={this.option.animationDuration}
        onHide={() => {
          ReactDOM.unmountComponentAtNode(this.container);
          this.container.remove();
          this.option.onClose?.();
        }}
        maskOption={this.option.maskOption}
      >
        {this.option.renderContent?.(this) ?? this.option.content}
      </Wrapper>
    );
  }

  /**
   * 主动调用以动画形式收起弹框，并且关闭它
   */
  close() {
    // 主动调用一个组件的方式是向它传递属性
    ReactDOM.render(this.createWrapper('hide'), this.container);
  }
}
