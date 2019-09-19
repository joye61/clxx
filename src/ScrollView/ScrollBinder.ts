import { is } from "../is";
import { css } from "emotion";
import { Interpolation } from "@emotion/serialize";
import { Ticker } from "../Ticker";
import { scroll } from "./scroll";
import { vw } from "../cssUtil";
import { thisTypeAnnotation } from "@babel/types";

export type ScrollTarget = string | HTMLElement | null;

export interface ScrollBinderOption {
  // 滚动容器目标
  target: ScrollTarget;
  // 当前滚动位置
  initPosition: number;
  // 滚动到底部时触发
  onReachBottom: () => void;
  // 滚动到顶部时触发
  onReachTop: () => void;
  // 滚动到顶部时触发事件的阈值
  reachTopThresHold: number;
  // 滚动到底部时触发事件的阈值
  reachBottomThresHold: number;
  // 是否显示滚动条
  showScrollBar: boolean;
  // 滚动条宽度
  barWidth: number;
  // 自动隐藏滚动条
  barAutoHide: boolean;
  // 滚动条自动隐藏延迟
  barHideDelay: number;
  // 滚动条自动隐藏持续时间
  barShowOrHideDuration: number;
  // 是否显示圆角滚动条
  barRounded: boolean;
  // 惯性滚动时速度衰减系数0<f<1，不能为0和1
  // 最好不要修改默认值，会影响流畅度
  speedFactor: number;
  // 滚动时触发
  onScroll: () => void;
}

export class ScrollBinder {
  /**
   * 默认配置
   */
  config: ScrollBinderOption = {
    target: null,
    initPosition: 0,
    onReachBottom() {},
    onReachTop() {},
    onScroll() {},
    reachBottomThresHold: 30,
    reachTopThresHold: 30,
    showScrollBar: false,
    barWidth: 4,
    barAutoHide: true,
    barRounded: false,
    barHideDelay: 2000,
    barShowOrHideDuration: 500,
    speedFactor: 0.98
  };

  // 滚动容器
  container: HTMLElement;
  // 滚动体
  body: HTMLElement;
  // 滚动条
  bar: HTMLElement | null = null;
  // 滚动条和容器的比例
  barRatio = 0;
  // 当前滚动到的位置
  position = 0;
  // CSS的兼容transform属性
  transform = this.transformProperty();
  // 滚动容器高度
  containerHeight = 0;
  // 滚动体高度
  bodyHeight = 0;
  // 滚动条高度
  barHeight = 0;
  // 容器和滚动内容的高度差
  diffHeight = 0;
  // 当前位置
  current = 0;
  // 惯性速度
  speed = 0;
  // 是否正在手指拖动滚动
  isControlling = false;
  // 当前定时器
  ticker: null | Ticker = null;
  // 隐藏bar的定时器
  hideBarTicker: null | Ticker = null;

  // 最后一次移动的时间
  moveTime = 0;
  // 结束移动的时间
  endTime = 0;

  constructor(option: ScrollTarget | ScrollBinderOption) {
    // 用户配置覆盖默认配置
    if (is.string(option)) {
      const target = document.querySelector(option);
      this.config.target = target as HTMLElement;
    } else if (is.element(option)) {
      this.config.target = option as HTMLElement;
    } else if (is.plainObject(option)) {
      this.config = { ...this.config, ...option };
    }

    // 设置目标容器
    if (!is.element(this.config.target)) {
      throw new Error("The scrolling target container does not exist");
    }
    this.container = this.config.target as HTMLElement;

    // 设置滚动子元素
    const children = this.container.children;
    if (children.length !== 1) {
      throw new Error(
        "The scrolling container must have one and only one child element"
      );
    }
    this.body = children[0] as HTMLElement;

    // 设置滚动条初始位置
    this.position = this.config.initPosition;

    // 初始化容器样式
    const containerCss: Interpolation = {
      overflow: "hidden"
    };
    const position = window.getComputedStyle(this.container).position;
    if (position === "static") {
      containerCss.position = "relative";
    }
    this.container.classList.add(css(containerCss));

    // 设置滚动条相关
    // this.setBarInfo();

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
      const barStyle: Interpolation = {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: `rgba(0, 0, 0, .6)`,
        width: vw(this.config.barWidth)
      };

      // 是否显示圆角滚动条
      if (this.config.barRounded) {
        barStyle.borderRadius = vw(this.config.barWidth / 2);
        barStyle["@media screen and (min-width: 576px)"] = {
          width: `${this.config.barWidth}px`,
          borderRadius: `${this.config.barWidth / 2}px`
        };
      } else {
        barStyle["@media screen and (min-width: 576px)"] = {
          width: `${this.config.barWidth}px`
        };
      }

      // 是否自动隐藏滚动条
      if (this.config.barAutoHide) {
        barStyle.transition = `opacity ${this.config.barShowOrHideDuration}ms`;
        barStyle.opacity = 0;
      }

      this.bar.classList.add(css(barStyle));
      this.container.appendChild(this.bar);

      // 添加PC端时滚动条的事件监听
      this.addBarEventBinder();
    }
  }

  /**
   * 隐藏滚动条
   */
  hideBar() {
    if (this.config.showScrollBar && this.config.barAutoHide) {
      this.hideBarTicker = new Ticker(
        () => {
          (<HTMLElement>this.bar).style.opacity = "0";
        },
        this.config.barHideDelay,
        1
      );
    }
  }

  /**
   * 显示滚动条
   */
  showBar() {
    if (this.config.showScrollBar && this.config.barAutoHide) {
      // 如果有bar正在隐藏，直接清除隐藏逻辑
      if (this.hideBarTicker instanceof Ticker) {
        this.hideBarTicker.destroy();
      }
      (<HTMLElement>this.bar).style.opacity = "1";
    }
  }

  updateBarHeight() {
    (<HTMLElement>this.bar).style.height = `${this.barHeight}px`;
  }

  /**
   * 当容器的内容有变化时，更新滚动条信息
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
    // 不能跨越边界
    if (this.position > 0) {
      this.position = 0;
      this.destroyTicker();
    } else if (this.position < this.diffHeight) {
      this.position = this.diffHeight;
      this.destroyTicker();
    }

    // 触顶时触发
    if (
      this.speed > 0 &&
      this.position <= 0 &&
      this.position >= -this.config.reachTopThresHold &&
      is.function(this.config.onReachTop)
    ) {
      this.config.onReachTop();
    }

    // 触底时触发
    if (
      this.speed < 0 &&
      this.position >= this.diffHeight &&
      this.position <= this.diffHeight + this.config.reachBottomThresHold &&
      is.function(this.config.onReachBottom)
    ) {
      this.config.onReachBottom();
    }

    // 执行DOM变换，实现滚动动画
    this.body.style[<any>this.transform] = `translateY(${this.position}px)`;
    if (this.config.showScrollBar) {
      (<HTMLElement>this.bar).style[<any>this.transform] = `translateY(${-this
        .position * this.barRatio}px)`;
    }
  }

  /**
   * 浏览器兼容transform属性名称
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
    return vendors[0];
  }

  onTouchStart = (event: TouchEvent) => {
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
      const touch = event.touches.item(0) as Touch;
      this.current = touch.clientY;
    }
  };

  onTouchMove = (event: TouchEvent) => {
    if (this.isControlling) {
      this.moveTime = Date.now();
      const touch = event.touches.item(0) as Touch;
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

  onTouchEnd = (event: TouchEvent) => {
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
      } else {
        // 禁止状态，隐藏滚动条
        this.hideBar();
      }
    }
  };

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
      } else {
        this.position += this.speed;
        this.updatePosition();
      }
      if (is.function(this.config.onScroll)) {
        this.config.onScroll();
      }
    });
  }

  onWheel = (event: WheelEvent) => {
    event.stopPropagation();
    this.position += event.deltaY;
    this.updatePosition();
    if (is.function(this.config.onScroll)) {
      this.config.onScroll();
    }
  };

  onMouseDown = (event: MouseEvent) => {
    if (this.diffHeight < 0 && !this.isControlling) {
      // 阻止冒泡可以防止滚动穿透
      event.stopPropagation();

      this.isControlling = true;

      // 显示滚动条
      this.showBar();
      this.current = event.clientY;
    }
  };

  onMouseMove = (event: MouseEvent) => {
    if(this.isControlling) {
      const current = event.clientY;
      console.log(current);
      const diff = current - this.current;
      console.log(diff);
      this.current = current;
      this.position -= diff;
      this.updatePosition();
      if (is.function(this.config.onScroll)) {
        this.config.onScroll();
      }
    }
  };

  onMouseUp = (event: MouseEvent) => {
    if(this.isControlling) {
      this.isControlling = false;
      this.current = 0;
      // 禁止状态，隐藏滚动条
      this.hideBar();
    }
  };

  addEventBinder() {
    if (is.touchable()) {
      this.container.addEventListener("touchstart", this.onTouchStart);
      this.container.addEventListener("touchmove", this.onTouchMove);
      this.container.addEventListener("touchend", this.onTouchEnd);
      this.container.addEventListener("touchcancel", this.onTouchEnd);
    } else {
      this.container.addEventListener("wheel", this.onWheel);
    }
  }

  addBarEventBinder() {
    // PC端环境需要支持滚动条拖动效果
    if (!is.touchable()) {
      (<HTMLElement>this.bar).addEventListener("mousedown", this.onMouseDown);
      document.documentElement.addEventListener("mousemove", this.onMouseMove);
      document.documentElement.addEventListener("mouseup", this.onMouseUp);
    }
  }
}
