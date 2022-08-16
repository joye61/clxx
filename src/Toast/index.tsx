import React from 'react';
import { uniqKey } from '../utils/uniqKey';
import { createPortalDOM, PortalDOM } from '../utils/dom';
import { Toast as ToastComponent, ToastProps } from './Toast';

/**
 * 显示一个全局的轻提示，这个toast不是唯一的
 * @param option 可以是一个字符串，也可以是一个React组件
 */
export function showToast(option: React.ReactNode | ToastProps) {
  const { mount, unmount } = createPortalDOM();
  let props: ToastProps = {};
  if (React.isValidElement(option) || typeof option !== 'object') {
    props.content = option;
  } else {
    props = option as ToastProps;
  }
  props.onHide = unmount;
  mount(<ToastComponent {...props} />);
}

/**
 * 生成一个全局唯一的Toast
 * @param option
 */
let portalDOM: PortalDOM | null = null;
export function showUniqToast(option: React.ReactNode | ToastProps) {
  if (!portalDOM) {
    portalDOM = createPortalDOM();
  }
  let props: ToastProps = {};
  // 默认Toast是唯一的
  if (React.isValidElement(option) || typeof option !== 'object') {
    props.content = option;
  } else {
    props = option as ToastProps;
  }

  const onHide = () => {
    portalDOM?.unmount();
    portalDOM = null;
  };
  props.onHide = onHide;
  portalDOM.mount(<ToastComponent {...props} key={uniqKey()} />);
}
