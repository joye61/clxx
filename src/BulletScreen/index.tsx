import React from "react";
import { is } from "../is";
import { css } from "emotion";
import ReactDOM from "react-dom";
import raf from "raf";
import { keyframes } from "@emotion/core";

export interface BSOption {
  // 弹幕播放的舞台
  target: string | HTMLElement;
}

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
      if(!this.target) {
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
    bulletContainer.classList.add(
      css({
        position: "absolute",
        left: 0,
        transform: `translate3d(${this.screenWidth}px, 0, 0)`,
        zIndex: 9
      })
    );
    ReactDOM.render(<>{item}</>, bulletContainer);
    (this.target as HTMLElement).appendChild(bulletContainer);

    // 在下一帧计算出元素的尺寸信息
    raf(() => {
      const rect = bulletContainer.getBoundingClientRect();
      const height = rect.height;
      // 动画关键帧
      const fly = keyframes`
        from {
          transform: translate3d(${this.screenWidth}px, 0, 0);
        }
        to {
          transform: translate3d(-100%, 0, 0);
        }
      `;
      
      // 弹幕设置为一个随机的高度出现在舞台中
      if (this.screenHeight > height) {
        const top = Math.random() * (this.screenHeight - height);
        bulletContainer.classList.add(
          css({
            top,
            animation: `${fly} ${duration}ms linear`
          })
        );
      }

      // 监听结束事件
      bulletContainer.addEventListener(this.animationEndName(), () => {
        ReactDOM.unmountComponentAtNode(bulletContainer);
        bulletContainer.remove();
      });
    });
  }

  // 获取跨浏览器兼容事件名
  animationEndName() {
    const testElement = document.createElement("div");

    const maps: any = {
      animation: "animationend",
      OAnimation: "oAnimationEnd",
      MozAnimation: "animationend",
      WebkitAnimation: "webkitAnimationEnd"
    };

    for (let key in maps) {
      if (is.undefined(testElement.style[key as any])) {
        return maps[key];
      }
    }
  }
}
