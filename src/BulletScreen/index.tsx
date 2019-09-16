import React from "react";
import { is } from "../is";
import { css } from "emotion";
import ReactDOM from "react-dom";
import raf from "raf";
import { keyframes } from "@emotion/core";
import anime from "animejs";

export interface BSOption {
  // 弹幕播放的舞台
  target: string | HTMLElement;
}

const bulletClass = css({
  position: "absolute",
  left: 0,
  zIndex: 9
});

export class BulletScreen {
  target: null | HTMLElement = null;
  screenWidth = 0;
  screenHeight = 0;

  constructor(option: string | HTMLElement | BSOption) {
    let checkTarget: string | HTMLElement = option as (string | HTMLElement);
    if (is.plainObject(option)) {
      checkTarget = (option as BSOption).target;
    }

    // 设置弹幕目标
    if (is.string(checkTarget)) {
      this.target = document.querySelector(checkTarget);
      if (!this.target) {
        throw new Error("The display target does not exist");
      }
    } else if (is.element(checkTarget)) {
      this.target = checkTarget as HTMLElement;
    } else {
      throw new Error("The display target of the barrage must be set");
    }

    // 舞台目标必须具备的CSS样式
    this.target = this.target as HTMLElement;
    const position = window.getComputedStyle(this.target).position;
    if (position === "static") {
      this.target.classList.add(
        css({ position: "relative", overflow: "hidden" })
      );
    }

    const rect = this.target.getBoundingClientRect();
    this.screenWidth = rect.width;
    this.screenHeight = rect.height;
  }

  /**
   *
   * @param item 弹幕内容，可以是任意ReactNode元素
   * @param duration 弹幕在屏幕上漂过持续时间
   */
  push(item: React.ReactNode, duration: number = 5000) {
    const bulletContainer = document.createElement("div");
    bulletContainer.classList.add(bulletClass);
    ReactDOM.render(<>{item}</>, bulletContainer);
    (this.target as HTMLElement).appendChild(bulletContainer);

    // 在下一帧计算出元素的尺寸信息
    raf(() => {
      const rect = bulletContainer.getBoundingClientRect();
      const height = rect.height;
      const transform = this.transformProperty() as any;
      bulletContainer.style[transform] = `translateX(${this.screenWidth}px)`;
      bulletContainer.style.top =
        Math.random() * (this.screenHeight - height) + "px";
      anime({
        targets: bulletContainer,
        translateX: -rect.width + "px",
        duration,
        easing: "linear",
        complete() {
          ReactDOM.unmountComponentAtNode(bulletContainer);
          bulletContainer.remove();
        }
      });
    });
  }

  /**
   * 获取transform属性名字
   */
  transformProperty() {
    const vendors: string[] = [
      "transform",
      "WebkitTransform",
      "MozTransform",
      "OTransform",
      "msTransform"
    ];
    for (let vendor of vendors) {
      if (is.string(document.body.style[vendor as any])) {
        return vendor;
      }
    }
  }
}
