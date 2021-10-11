import React from 'react';
import ReactDOM from 'react-dom';
import { Toast as ToastComponent, ToastProps } from './Toast';
import { is } from '../utils/is';

// 全局唯一的Toast容器实例，保证全局只能存在一个Toast
let containerInstance: HTMLElement | null = null;

export function showToast(option: React.ReactNode | ToastProps) {
  if (containerInstance === null) {
    // 容器不存在，创建一个Toast容器
    containerInstance = document.createElement('div');
    document.body.appendChild(containerInstance);
  } else {
    // 如果容器存在，说明上一个Toast还在显示着，清除上一个Toast内容
    ReactDOM.unmountComponentAtNode(containerInstance);
  }

  let props: ToastProps = {};
  if(React.isValidElement(option) || !is.isPlainObject(option)) {
    props.content = option;
  } else {
    props = option as ToastProps;
  }

  // 组件显示时间到了，清理容器
  props.onHide = () => {
    if (containerInstance instanceof HTMLElement) {
      ReactDOM.unmountComponentAtNode(containerInstance);
      containerInstance.remove();
      containerInstance = null;
    }
  };

  ReactDOM.render(<ToastComponent {...props} />, containerInstance);
}
