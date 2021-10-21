import React from "react";
import ReactDOM from "react-dom";

export interface PortalDOM {
  element: HTMLDivElement;
  mount: (component: React.ReactNode) => Promise<void>;
  destroy: () => void;
}

/**
 * 类似ReactDOM.createPortal，这个函数将会在body下创建一个组件的挂载点
 * 组件可以通过函数的第一个参数传递进去
 *
 * @param point HTMLElement 挂载点
 * @returns CreatePortalDOMResult
 */
export function createPortalDOM(point?: HTMLElement): PortalDOM {
  const element = document.createElement("div");
  let mountPoint: HTMLElement = document.body;
  if (point instanceof HTMLElement) {
    mountPoint = point;
  }
  mountPoint.appendChild(element);

  return {
    element,
    async mount(component) {
      return new Promise<void>((resolve) => {
        ReactDOM.render(<>{component}</>, element, resolve);
      });
    },
    destroy() {
      if (element instanceof HTMLDivElement) {
        ReactDOM.unmountComponentAtNode(element);
        if (typeof element.remove === "function") {
          element.remove();
        } else {
          mountPoint.removeChild(element);
        }
      }
    },
  };
}
