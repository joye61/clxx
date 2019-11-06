import React from "react";
import { is } from "../is";
import { css } from "emotion";
import ReactDOM from "react-dom";
import { compat } from "../compat";
const bulletClass = css({
    position: "absolute",
    left: 0,
    zIndex: 9,
    transitionProperty: "transform",
    transitionTimingFunction: "linear"
});
export class BulletScreen {
    constructor(option) {
        this.target = null;
        this.screenWidth = 0;
        this.screenHeight = 0;
        let checkTarget = option;
        if (is.plainObject(option)) {
            checkTarget = option.target;
        }
        // 设置弹幕目标
        if (is.string(checkTarget)) {
            this.target = document.querySelector(checkTarget);
            if (!this.target) {
                throw new Error("The display target does not exist");
            }
        }
        else if (is.element(checkTarget)) {
            this.target = checkTarget;
        }
        else {
            throw new Error("The display target of the barrage must be set");
        }
        // 舞台目标必须具备的CSS样式
        this.target = this.target;
        const position = window.getComputedStyle(this.target).position;
        if (position === "static") {
            this.target.classList.add(css({ position: "relative", overflow: "hidden" }));
        }
        const rect = this.target.getBoundingClientRect();
        this.screenWidth = rect.width;
        this.screenHeight = rect.height;
    }
    /**
     * 向舞台中插入一条弹幕
     * @param item 弹幕内容，可以是任意ReactNode元素
     * @param duration 弹幕在屏幕上漂过持续时间
     */
    push(item, duration = 5000) {
        // 创建一个承载单条弹幕的容器
        const bulletContainer = document.createElement("div");
        this.target.appendChild(bulletContainer);
        // 设置每一条弹幕容器的初始样式
        bulletContainer.classList.add(bulletClass);
        bulletContainer.style[compat.transform] = `translateX(${this.screenWidth}px)`;
        bulletContainer.style[compat.transitionDuration] = `${duration}ms`;
        // 弹幕渲染进舞台
        ReactDOM.render(React.createElement(React.Fragment, null, item), bulletContainer, () => {
            // 获取当前弹幕的尺寸
            const rect = bulletContainer.getBoundingClientRect();
            // 设置当前弹幕的高度为随机
            bulletContainer.style.top =
                Math.random() * (this.screenHeight - rect.height) + "px";
            // 让弹幕飘过舞台
            bulletContainer.style[compat.transform] = `translateX(-${rect.width}px)`;
        });
        // 创建一个监听弹幕动画完成的事件
        bulletContainer.addEventListener(compat.transitionend, () => {
            ReactDOM.unmountComponentAtNode(bulletContainer);
            bulletContainer.remove();
        });
    }
}
