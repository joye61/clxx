import { is } from "../is";
import { css } from "emotion";
export class Activable {
    /**
     * 支持三种参数类型
     * 1、字符串代表选择器
     * 2、DOM元素
     * 3、对象形式
     * @param option
     */
    constructor(option) {
        this.activeStyle = css({ opacity: 0.5 });
        this.bubbleable = false;
        this.onClick = (e) => { };
        // 当前是否处于活跃状态
        this.isActive = false;
        /**
         * 触摸开始或鼠标点击
         */
        this.onStart = (event) => {
            if (!this.isActive) {
                this.isActive = true;
                if (!this.bubbleable) {
                    event.stopPropagation();
                }
                // 点击开始，设置活动样式
                this.setActiveClass();
            }
        };
        /**
         * 触摸结束
         */
        this.touchEnd = (event) => {
            const touch = event.changedTouches[0];
            this.onEnd(touch.clientX, touch.clientY);
        };
        /**
         * 鼠标弹起
         */
        this.mouseUp = (event) => {
            this.onEnd(event.clientX, event.clientY);
        };
        if (is.string(option) || is.element(option)) {
            this.target = this.getDOMTarget(option);
        }
        else if (is.plainObject(option)) {
            option = option;
            this.target = this.getDOMTarget(option.target);
            // 获取活跃时的类名
            this.activeClass = is.string(option.activeClass)
                ? option.activeClass
                : undefined;
            // 如果活跃类名已通过参数传递，则默认活跃样式清除
            if (this.activeClass) {
                this.activeStyle = undefined;
            }
            // 如果活跃样式已通过参数传递，设置活跃时的样式
            if (is.plainObject(option.activeStyle)) {
                this.activeStyle = css(option.activeStyle);
            }
            // 是否可冒泡，即是否允许点击穿透
            this.bubbleable = !!option.bubblable;
            // 点击事件
            if (is.function(option.onClick)) {
                this.onClick = option.onClick;
            }
        }
        else {
            throw new Error("Constructor parameter error");
        }
        // 开始执行绑定逻辑
        this.startBind();
    }
    /**
     * 停止触摸或者鼠标点击弹起时触发
     *
     * @param pointX 触摸点或鼠标点的X坐标
     * @param pointY 触摸点或鼠标点的Y坐标
     */
    onEnd(pointX, pointY) {
        if (this.isActive) {
            // 获取鼠标弹起时的元素
            const endElement = document.elementFromPoint(pointX, pointY);
            // 只有当触摸结束时在目标元素上才触发事件
            if (this.target.contains(endElement)) {
                this.onClick(this);
            }
        }
        // 任意状态下只要结束就要清理激活状态
        this.unsetActiveClass();
        this.isActive = false;
    }
    destroy() {
        if (is.touchable()) {
            this.target.removeEventListener("touchstart", this.onStart);
            this.target.removeEventListener("touchend", this.touchEnd);
            this.target.removeEventListener("touchcancel", this.touchEnd);
        }
        else {
            this.target.removeEventListener("mousedown", this.onStart);
            document.documentElement.removeEventListener("mouseup", this.mouseUp);
        }
    }
    startBind() {
        if (is.touchable()) {
            // 支持触摸环境
            this.target.addEventListener("touchstart", this.onStart);
            this.target.addEventListener("touchend", this.touchEnd);
            this.target.addEventListener("touchcancel", this.touchEnd);
        }
        else {
            // 支持非触摸环境
            this.target.addEventListener("mousedown", this.onStart);
            // 注：鼠标事件在弹起时如果落点不在监听目标上，事件不会触发
            document.documentElement.addEventListener("mouseup", this.mouseUp);
        }
    }
    getDOMTarget(target) {
        if (is.string(target)) {
            const possible = document.querySelector(target);
            if (!is.element(possible)) {
                throw new Error("The target element does not exist");
            }
            return possible;
        }
        else if (is.element(target)) {
            return target;
        }
        else {
            throw new Error("Activable targets must be specified");
        }
    }
    /**
     * 设置active状态
     */
    setActiveClass() {
        if (is.string(this.activeClass)) {
            this.target.classList.add(this.activeClass);
        }
        if (is.string(this.activeStyle)) {
            this.target.classList.add(this.activeStyle);
        }
    }
    /**
     * 清楚active状态
     */
    unsetActiveClass() {
        if (is.string(this.activeClass)) {
            this.target.classList.remove(this.activeClass);
        }
        if (is.string(this.activeStyle)) {
            this.target.classList.remove(this.activeStyle);
        }
    }
}
