import React from 'react';
import { createPortalDOM } from '../utils/dom';
import { DialogType } from './style';
import { WrapperProps, Wrapper } from './Wrapper';
import isPlainObject from 'lodash/isPlainObject';
import omit from 'lodash/omit';

export interface ShowDialogOption extends WrapperProps {
  // 空白处可点击关闭
  blankClosable?: boolean;
  // 弹框内容
  content?: React.ReactNode;
  // 弹窗类型
  type?: DialogType;
}

/**
 * 显示一个对话框，出现和隐藏都带有动画效果
 *
 * 关键不变量：
 * 1. 关闭操作幂等：多次调用返回的 close()，或 close() 与遮罩点击并发，都只触发一次隐藏动画与 unmount。
 * 2. 所有等待同一次关闭的 Promise 都会 resolve（不会因后续调用覆盖 onHide 而悬挂）。
 * 3. 用户的 onBlankClick 在事件循环同步阶段触发（避免 React 合成事件被回收），关闭动画并行进行。
 *
 * @param option
 * @returns 关闭函数；返回的 Promise 在隐藏动画结束、容器卸载完成后 resolve
 */
export function showDialog(option: React.ReactNode | ShowDialogOption) {
  const { mount, unmount } = createPortalDOM();

  // 生成全部配置
  let config: ShowDialogOption = { status: 'show', blankClosable: false };
  if (React.isValidElement(option) || !isPlainObject(option)) {
    config.content = option as React.ReactNode;
  } else {
    config = { ...config, ...(option as ShowDialogOption) };
  }

  // 提取需要单独处理的配置项
  const blankClosable = !!config.blankClosable;
  const children = config.content;
  const userOnBlankClick = config.onBlankClick;
  const userOnHide = config.onHide;
  const props: WrapperProps = omit(config, [
    'blankClosable',
    'content',
    'onHide',
    'onBlankClick',
  ]);

  // 关闭状态机：'idle' -> 'closing' -> 'closed'
  // 通过状态保证 closeDialog 幂等，避免重复 mount 已 unmount 的 root，避免 onHide 覆盖丢失 resolve
  let closeState: 'idle' | 'closing' | 'closed' = 'idle';
  const waiters: Array<() => void> = [];

  const closeDialog = (): Promise<void> => {
    if (closeState === 'closed') {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      waiters.push(resolve);
      if (closeState === 'closing') {
        // 已经在关闭流程中，仅排队等待
        return;
      }
      closeState = 'closing';
      props.status = 'hide';
      props.onHide = () => {
        // 防御：onAnimationEnd 仅应触发一次，但若 React 重渲染导致再次冒泡也只处理一次
        if (closeState === 'closed') return;
        closeState = 'closed';
        unmount();
        try {
          userOnHide?.();
        } finally {
          // 唤醒全部等待者，即使 user onHide 抛错也不影响 Promise 链
          const list = waiters.splice(0);
          list.forEach((fn) => fn());
        }
      };
      mount(<Wrapper {...props}>{children}</Wrapper>);
    });
  };

  // 空白处可点击关闭：同步触发用户回调，并行启动关闭动画
  if (blankClosable) {
    props.onBlankClick = (event) => {
      // 先同步调用用户回调（保留事件对象的有效性）
      userOnBlankClick?.(event);
      // 再触发关闭（不 await，避免事件对象失效）
      closeDialog();
    };
  } else if (userOnBlankClick) {
    // 不自动关闭但用户仍订阅了 blank click
    props.onBlankClick = userOnBlankClick;
  }

  // 挂载容器对象
  mount(<Wrapper {...props}>{children}</Wrapper>);

  return closeDialog;
}
