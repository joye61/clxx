import { is } from "../is";
import { css } from "emotion";
import { CSSProperties, Interpolation } from "@emotion/serialize";

export type ScrollTarget = string | HTMLElement;

export interface ScrollBinderOption {
  target: ScrollTarget;
  position: 0
}

export class ScrollBinder {
  container: HTMLElement;
  body: HTMLElement;
  constructor(option: ScrollTarget | ScrollBinderOption) {
    // 获取滚动容器对象
    let target: ScrollTarget;
    if (is.plainObject(option)) {
      target = (option as ScrollBinderOption).target;
    } else {
      target = option as any;
    }

    if (is.string(target)) {
      const domTarget = document.querySelector(target);
      if (!domTarget) {
        throw new Error("The scrolling target container does not exist");
      }
      this.container = domTarget as HTMLElement;
    } else if (is.element(target)) {
      this.container = target;
    } else {
      throw new Error(
        "The scrolling container cannot be resolved with the constructor argument"
      );
    }

    const children = this.container.children;
    if (children.length !== 1) {
      throw new Error(
        "The scrolling container must have one and only one child element"
      );
    }

    this.body = children[0] as HTMLElement;

    // 初始化相关样式
    const containerCss: Interpolation = {
      overflow: "hidden"
    };
    const position = window.getComputedStyle(this.container).position;
    if (position === "static") {
      containerCss.position = "relative";
    }
    this.container.classList.add(css(containerCss));
  }
}
