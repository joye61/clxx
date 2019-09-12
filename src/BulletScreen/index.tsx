import React, { ReactFragment } from "react";
import { is } from "../is";
import { css } from "emotion";
import ReactDOM from "react-dom";

export interface BSOption {
  // 弹幕播放的舞台
  target: string | HTMLElement;
  maxShowNum: number;
  loop: boolean;
}

export class BulletScreen<T> {
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
    } else if (is.element(checkTarget)) {
      this.target = checkTarget as HTMLElement;
    } else {
      throw new Error("The display target of the barrage must be set");
    }

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
   * @param item
   */
  push(item: React.ReactNode) {
    const bulletContainer = document.createElement("div");
    ReactDOM.render(<>{item}</>, bulletContainer);
  }
}
