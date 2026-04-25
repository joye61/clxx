import React from 'react';
import { createRoot } from 'react-dom/client';

export interface PortalDOM {
  element: HTMLDivElement;
  mount: (component: React.ReactNode) => void;
  unmount: () => void;
}

/**
 * 
 * 组件可以通过函数的第一个参数传递进去
 *
 * @param point HTMLElement 挂载点，如果未指定，则挂载点为body
 * @returns CreatePortalDOMResult
 */
export function createPortalDOM(point?: HTMLElement): PortalDOM {
  const container = document.createElement('div');
  let mountPoint: HTMLElement = document.body;
  if (point instanceof HTMLElement) {
    mountPoint = point;
  }
  mountPoint.appendChild(container);
  const root = createRoot(container);

  return {
    element: container,
    mount(component) {
      root.render(component);
    },
    unmount() {
      // 先卸载 React 根，再从 DOM 移除容器
      // React 18+ 推荐先 unmount 让 React 完成清理（包括 effect 的 cleanup），
      // 然后再移除真实 DOM 节点；倒过来在严格模式下可能产生警告
      root.unmount();
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    },
  };
}
