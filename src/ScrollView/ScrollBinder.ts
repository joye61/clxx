import { is } from "../is";
import { css } from "emotion";
import { Interpolation } from "@emotion/serialize";
import { Ticker } from "../Ticker";
import { scroll } from "./scroll";
import { vw } from "../cssUtil";

export type ScrollTarget = string | HTMLElement;

export interface ScrollBinderOption {
  // 滚动容器目标
  target: ScrollTarget;
  // 当前滚动位置
  position?: number;
  // 滚动到底部时触发
  onReachBottom?: () => void;
  // 滚动到顶部时触发
  onReachTop?: () => void;
  // 滚动到顶部时触发事件的阈值
  reachTopThresHold?: number;
  // 滚动到底部时触发事件的阈值
  reachBottomThresHold?: number;
}

export class ScrollBinder {
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

  // 最后一次移动的时间
  moveTime = 0;
  // 结束移动的时间
  endTime = 0;

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

    if (is.plainObject(option)) {
      option = option as ScrollBinderOption;

      // 可以设置滚动元素的初始位置
      if (is.number(option.position)) {
        this.position = option.position;
      }

      // 其他参数 TODO
    }

    // 初始化相关样式
    const containerCss: Interpolation = {
      overflow: "hidden"
    };
    const position = window.getComputedStyle(this.container).position;
    if (position === "static") {
      containerCss.position = "relative";
    }
    this.container.classList.add(css(containerCss));

    // 设置滚动条
    this.setBarInfo();

    // 获取初始尺寸信息
    this.updateSizeInfo();

    // 设置初始位置
    this.updatePosition();

    // 添加事件绑定信息
    this.addEventBinder();
  }

  setBarInfo() {
    this.bar = document.createElement("div");
    this.bar.classList.add(
      css({
        position: "absolute",
        top: 0,
        right: 0,
        width: vw(2),
        backgroundColor: `rgba(0,0,0,.5)`,
        "@media screen and (min-width: 576px)": {
          width: `4px`
        }
      })
    );
    this.container.appendChild(this.bar);
  }

  updateBarHeight() {
    (<HTMLElement>this.bar).style.height = `${this.barHeight}px`;
  }

  updateSizeInfo() {
    this.containerHeight = this.container.getBoundingClientRect().height;
    this.bodyHeight = this.body.getBoundingClientRect().height;
    this.diffHeight = this.containerHeight - this.bodyHeight;

    // 滚动条相关
    this.barRatio = this.containerHeight / this.bodyHeight;
    this.barHeight = this.containerHeight * this.barRatio;
    this.updateBarHeight();
  }

  updatePosition() {
    if (this.position > 0) {
      this.position = 0;
      this.destroyTicker();
    } else if (this.position < this.diffHeight) {
      this.position = this.diffHeight;
      this.destroyTicker();
    }
    this.body.style[<any>this.transform] = `translateY(${this.position}px)`;
    if (is.element(this.bar)) {
      (<HTMLElement>this.bar).style[<any>this.transform] = `translateY(${-this
        .position * this.barRatio}px)`;
    }
  }

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

  onStart = (event: TouchEvent) => {
    if (this.diffHeight < 0 && !this.isControlling) {
      // 阻止冒泡可以防止滚动穿透
      event.preventDefault();
      // 防止浏览器默认滚动
      scroll.stop();
      /**
       * 连续滚动时有可能上一个惯性还没停止
       * 需要将惯性滚动停止下来
       */
      this.destroyTicker();
      this.speed = 0;

      this.isControlling = true;
      const touch = event.touches.item(0) as Touch;
      this.current = touch.clientY;
    }
  };

  onMove = (event: TouchEvent) => {
    if (this.isControlling) {
      this.moveTime = Date.now();
      const touch = event.touches.item(0) as Touch;
      const current = touch.clientY;
      this.speed = current - this.current;
      this.current = current;
      this.position += this.speed;
      this.updatePosition();
    }
  };

  onEnd = (event: TouchEvent) => {
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
    }
  };

  destroyTicker() {
    if (this.ticker instanceof Ticker) {
      this.ticker.destroy();
      this.ticker = null;
    }
  }

  /**
   * 执行惯性滚动
   */
  inertia() {
    // 缓动系数
    const rate = 0.985;
    this.ticker = new Ticker(() => {
      // 缓动逻辑
      this.speed *= rate;
      // 当步进距离小于一个像素时，停止惯性
      if (Math.abs(this.speed) < 0.1) {
        this.destroyTicker();
      } else {
        this.position += this.speed;
        this.updatePosition();
      }
    });
  }

  addEventBinder() {
    this.container.addEventListener("touchstart", this.onStart);
    this.container.addEventListener("touchmove", this.onMove);
    this.container.addEventListener("touchend", this.onEnd);
    this.container.addEventListener("touchcancel", this.onEnd);
  }

  removeEventBinder() {
    this.container.removeEventListener("touchstart", this.onStart);
    this.container.removeEventListener("touchmove", this.onMove);
    this.container.removeEventListener("touchend", this.onEnd);
    this.container.removeEventListener("touchcancel", this.onEnd);
  }
}
