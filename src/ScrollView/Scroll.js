import Handler from "./Handler";
import movement from "./movement";
import { passiveSupported } from "./env";
import raf from "raf";

export default class Scroll {
  constructor(container) {
    if (!container) {
      throw new Error("Should specify scroll container");
    }

    // 获取转换属性，解决兼容问题
    this.transformAttr = this.getTransformAttr() || "transform";

    // 根容器
    if (container instanceof Element) {
      this.container = container;
    } else if (typeof container === "string") {
      this.container = document.querySelector(container);
    }
    // 内容容器
    this.content = this.container.children.item(0);
    this.refreshSize();

    // 禁用默认滚动
    this.stopDefaultScrollHandler = event => event.preventDefault();
    this.stopDefaulScroll();

    // 触摸事件处理
    this.handler = new Handler();
    this.scheduleUpdate = false;
    this.updater = this.updatePosition.bind(this);
    this.touchStartHandler = this.handler.onStart.bind(this.handler);
    this.touchMoveHandler = event => {
      this.handler.onMove.bind(this.handler, event);
      if(this.scheduleUpdate) {
        return ;
      }
      this.scheduleUpdate = true;
      raf(this.updater);
    };
    this.touchEndHandler = this.handler.onStop.bind(this.handler);
    this.touchCancelHandler = this.handler.onStop.bind(this.handler);
    this.bindHandle();

    // 运动管理
    this.movement = movement.initialize(this, this.updatePosition.bind(this));
  }

  getTransformAttr() {
    const attrs = ["transform", "webkitTransform", "mozTransform", "ms", "o"];
    for (let attr of attrs) {
      if (typeof document.body.style[attr] === "string") {
        this.transformAttr = attr;
        break;
      }
    }
  }

  // 更新位置
  updatePosition() {
    this.content.style[this.transformAttr] = `translate3d(0, ${position}px, 0)`;
    this.scheduleUpdate = false;
  }

  // 获取尺寸相关信息
  refreshSize() {
    this.containerSize = this.container.getBoundingClientRect().height;
    this.contentSize = this.content.getBoundingClientRect().height;
    this.scrollRange = [this.containerSize - this.contentSize, 0];
  }

  /**
   * 禁用默认滚动
   */
  stopDefaulScroll() {
    document.documentElement.addEventListener(
      "touchstart",
      this.stopDefaultScrollHandler,
      passiveSupported ? { passive: false } : false
    );
  }

  /**
   * 恢复默认滚动
   */
  recoverDefaultScroll() {
    document.documentElement.removeEventListener(
      "touchstart",
      this.stopDefaultScrollHandler
    );
  }

  /**
   * 触摸事件处理
   */
  bindHandle() {
    this.container.addEventListener("touchstart", this.touchStartHandler);
    this.container.addEventListener("touchmove", this.touchMoveHandler);
    this.container.addEventListener("touchend", this.touchEndHandler);
    this.container.addEventListener("touchcancel", this.touchCancelHandler);
  }

  /**
   * 销毁滚动实例，一般在滚动容器被从DOM中删除之后可以调用这个方法
   */
  destroy() {
    this.recoverDefaultScroll();
    this.container.removeEventListener("touchstart", this.touchStartHandler);
    this.container.removeEventListener("touchmove", this.touchMoveHandler);
    this.container.removeEventListener("touchend", this.touchEndHandler);
    this.container.removeEventListener("touchcancel", this.touchCancelHandler);
    this.movement.destroy();
  }
}
