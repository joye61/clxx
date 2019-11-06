import { is } from "../is";
import { css } from "emotion";
import { Ticker } from "../Ticker";
import { scroll } from "./scroll";
import { vw } from "../cssUtil";
import { compat } from "../compat";
export class ScrollBinder {
    constructor(option) {
        /**
         * 默认配置
         */
        this.config = {
            target: null,
            initPosition: 0,
            onReachBottom() { },
            onReachTop() { },
            onScroll() { },
            reachBottomThresHold: 30,
            reachTopThresHold: 30,
            showScrollBar: false,
            barWidth: 4,
            barAutoHide: true,
            barRounded: true,
            barHideDelay: 3000,
            barShowOrHideDuration: 500,
            barStyle: {},
            speedFactor: 0.98
        };
        // 滚动条
        this.bar = null;
        // 滚动条和容器的比例
        this.barRatio = 0;
        // CSS的兼容transform属性
        this.transform = compat.transform;
        // 滚动容器高度
        this.containerHeight = 0;
        // 滚动体高度
        this.bodyHeight = 0;
        // 滚动条高度
        this.barHeight = 0;
        // 容器和滚动内容的高度差
        this.diffHeight = 0;
        // 当前位置，临时位置
        this.current = 0;
        // 当前滚动到的位置，最终经过计算的位置
        this.position = 0;
        // 惯性速度
        this.speed = 0;
        // 是否正在手指拖动滚动
        this.isControlling = false;
        // 当前定时器
        this.ticker = null;
        // 隐藏bar的定时器
        this.hideBarTicker = null;
        // 最后一次移动的时间
        this.moveTime = 0;
        // 结束移动的时间
        this.endTime = 0;
        this.onTouchStart = (event) => {
            if (this.diffHeight < 0 && !this.isControlling) {
                // 阻止冒泡可以防止滚动穿透
                event.stopPropagation();
                // 防止浏览器默认滚动
                scroll.stop();
                /**
                 * 连续滚动时有可能上一个惯性还没停止
                 * 需要将惯性滚动停止下来
                 */
                this.destroyTicker();
                this.speed = 0;
                // 显示滚动条
                this.showBar();
                this.isControlling = true;
                const touch = event.touches.item(0);
                this.current = touch.clientY;
            }
        };
        this.onTouchMove = (event) => {
            if (this.isControlling) {
                this.moveTime = Date.now();
                const touch = event.touches.item(0);
                const current = touch.clientY;
                this.speed = current - this.current;
                this.current = current;
                this.position += this.speed;
                this.updatePosition();
                if (is.function(this.config.onScroll)) {
                    this.config.onScroll();
                }
            }
        };
        this.onTouchEnd = () => {
            if (this.isControlling) {
                this.endTime = Date.now();
                this.isControlling = false;
                this.current = 0;
                // 开启浏览器默认滚动
                scroll.enable();
                /**
                 * 惯性滚动必须满足两个条件
                 * 1、手指停留时间不超过300ms
                 * 2、惯性速度绝对值大于0
                 */
                if (this.endTime - this.moveTime < 300 && Math.abs(this.speed) > 0) {
                    // 开始惯性滚动
                    this.inertia();
                }
                else {
                    // 禁止状态，隐藏滚动条
                    this.hideBar();
                }
            }
        };
        this.onWheel = (event) => {
            if (this.diffHeight < 0 && !this.isControlling) {
                event.stopPropagation();
                // 显示滚动条
                this.showBar();
                /**
                 * 根据滚动条的模式，设置不同的滚动方向
                 */
                if (event.deltaMode === 0) {
                    this.speed = event.deltaY;
                }
                else {
                    this.speed = (event.deltaY / Math.abs(event.deltaY)) * 200;
                }
                this.position += this.speed;
                console.log(event.deltaY, event.deltaMode);
                this.updatePosition();
                if (is.function(this.config.onScroll)) {
                    this.config.onScroll();
                }
                // 隐藏滚动条
                this.hideBar();
            }
        };
        this.onMouseDown = (event) => {
            if (this.diffHeight < 0 && !this.isControlling) {
                // 阻止冒泡可以防止滚动穿透
                event.stopPropagation();
                this.isControlling = true;
                // 显示滚动条
                this.showBar();
                this.current = event.clientY;
            }
        };
        this.onMouseMove = (event) => {
            if (this.isControlling) {
                const current = event.clientY;
                this.speed = (this.current - current) / this.barRatio;
                this.current = current;
                this.position += this.speed;
                this.updatePosition();
                if (is.function(this.config.onScroll)) {
                    this.config.onScroll();
                }
            }
        };
        this.onMouseUp = () => {
            if (this.isControlling) {
                this.isControlling = false;
                this.current = 0;
                // 禁止状态，隐藏滚动条
                this.hideBar();
            }
        };
        // 用户配置覆盖默认配置
        if (is.string(option)) {
            const target = document.querySelector(option);
            this.config.target = target;
        }
        else if (is.element(option)) {
            this.config.target = option;
        }
        else if (is.plainObject(option)) {
            this.config = Object.assign(Object.assign({}, this.config), option);
        }
        // 设置目标容器
        if (!is.element(this.config.target)) {
            throw new Error("The scrolling target container does not exist");
        }
        this.container = this.config.target;
        // 设置滚动子元素
        const children = this.container.children;
        if (children.length !== 1) {
            throw new Error("The scrolling container must have one and only one child element");
        }
        this.body = children[0];
        // 设置滚动条初始位置
        this.position = -this.config.initPosition;
        // 初始化容器样式
        const containerCss = {
            overflow: "hidden"
        };
        const position = window.getComputedStyle(this.container).position;
        if (position === "static") {
            containerCss.position = "relative";
        }
        this.container.classList.add(css(containerCss));
        // 获取初始尺寸信息
        this.update();
        // 设置初始位置
        this.updatePosition();
        // 添加事件绑定信息
        this.addEventBinder();
    }
    /**
     * 显示滚动条信息
     */
    setBarInfo() {
        if (this.config.showScrollBar && this.diffHeight < 0 && this.bar === null) {
            this.bar = document.createElement("div");
            // 滚动条样式设置
            const barStyle = Object.assign({ userSelect: "none", position: "absolute", top: 0, right: 0, backgroundColor: `rgba(0, 0, 0, .6)`, width: vw(this.config.barWidth) }, this.config.barStyle);
            // 是否显示圆角滚动条
            if (this.config.barRounded) {
                barStyle.borderRadius = vw(this.config.barWidth / 2);
                barStyle["@media screen and (min-width: 576px)"] = {
                    width: `${this.config.barWidth * 2}px`,
                    borderRadius: `${this.config.barWidth}px`
                };
            }
            else {
                barStyle["@media screen and (min-width: 576px)"] = {
                    width: `${this.config.barWidth * 2}px`,
                    borderRadius: 0
                };
            }
            // 是否自动隐藏滚动条
            if (this.config.barAutoHide) {
                barStyle.transition = `opacity ${this.config.barShowOrHideDuration}ms`;
                barStyle.opacity = 0;
            }
            this.bar.classList.add(css(barStyle));
            this.container.appendChild(this.bar);
            // 添加PC端时滚动条的事件监听，此处可以保证滚动条是存在的
            this.addBarEventBinder();
        }
    }
    /**
     * 隐藏滚动条
     */
    hideBar() {
        if (is.element(this.bar) && this.config.barAutoHide) {
            this.hideBarTicker = new Ticker(() => {
                this.bar.style.opacity = "0";
            }, this.config.barHideDelay, 1);
        }
    }
    /**
     * 显示滚动条
     */
    showBar() {
        if (is.element(this.bar) && this.config.barAutoHide) {
            // 如果有bar正在隐藏，直接清除隐藏逻辑
            if (this.hideBarTicker instanceof Ticker) {
                this.hideBarTicker.destroy();
            }
            this.bar.style.opacity = "1";
        }
    }
    updateBarHeight() {
        if (is.element(this.bar)) {
            this.bar.style.height = `${this.barHeight}px`;
        }
    }
    /**
     * 当容器的内容有变化时，更新滚动条信息，主要供外部调用
     */
    update() {
        this.containerHeight = this.container.getBoundingClientRect().height;
        this.bodyHeight = this.body.getBoundingClientRect().height;
        this.diffHeight = this.containerHeight - this.bodyHeight;
        // 滚动条相关
        if (this.diffHeight < 0 && this.config.showScrollBar) {
            this.barRatio = this.containerHeight / this.bodyHeight;
            this.barHeight = this.containerHeight * this.barRatio;
            this.setBarInfo();
            this.updateBarHeight();
        }
    }
    /**
     * 这里不应该有过多逻辑，影响滚动性能
     */
    updatePosition() {
        // 滚动条内容不大于容器内容时，不执行任何更新逻辑
        if (this.diffHeight >= 0) {
            return;
        }
        // 不能跨越边界
        if (this.position > 0) {
            this.position = 0;
            this.destroyTicker();
        }
        else if (this.position < this.diffHeight) {
            this.position = this.diffHeight;
            this.destroyTicker();
        }
        // 触顶时触发
        if (this.speed > 0 &&
            this.position <= 0 &&
            this.position >= -this.config.reachTopThresHold &&
            is.function(this.config.onReachTop)) {
            this.config.onReachTop();
        }
        // 触底时触发
        if (this.speed < 0 &&
            this.position >= this.diffHeight &&
            this.position <= this.diffHeight + this.config.reachBottomThresHold &&
            is.function(this.config.onReachBottom)) {
            this.config.onReachBottom();
        }
        this.body.style[this.transform] = `translateY(${this.position}px)`;
        if (is.element(this.bar)) {
            this.bar.style[this.transform] = `translateY(${-this
                .position * this.barRatio}px)`;
        }
    }
    // 销毁惯性滚动的定时器
    destroyTicker() {
        if (this.ticker instanceof Ticker) {
            this.ticker.destroy();
            this.ticker = null;
            this.hideBar();
        }
    }
    /**
     * 执行惯性滚动
     */
    inertia() {
        this.ticker = new Ticker(() => {
            // 缓动逻辑
            this.speed *= this.config.speedFactor;
            // 当步进距离小于一个像素时，停止惯性
            if (Math.abs(this.speed) < 0.1) {
                this.destroyTicker();
            }
            else {
                this.position += this.speed;
                this.updatePosition();
            }
            if (is.function(this.config.onScroll)) {
                this.config.onScroll();
            }
        });
    }
    addEventBinder() {
        if (is.touchable()) {
            this.container.addEventListener("touchstart", this.onTouchStart);
            this.container.addEventListener("touchmove", this.onTouchMove);
            this.container.addEventListener("touchend", this.onTouchEnd);
            this.container.addEventListener("touchcancel", this.onTouchEnd);
        }
        else {
            this.container.addEventListener("wheel", this.onWheel);
        }
    }
    /**
     * PC端滚动不带惯性效果，跟原生的PC效果保持一致
     */
    addBarEventBinder() {
        // PC端环境需要支持滚动条拖动效果
        if (!is.touchable()) {
            this.bar.addEventListener("mousedown", this.onMouseDown);
            document.documentElement.addEventListener("mousemove", this.onMouseMove);
            document.documentElement.addEventListener("mouseup", this.onMouseUp);
        }
    }
}
