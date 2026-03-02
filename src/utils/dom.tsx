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
      // 先从 DOM 移除容器，再卸载 React 树
      // 避免 React 18+ 在已卸载的根上发出警告
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
      root.unmount();
    },
  };
}
