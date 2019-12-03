/**
 * 检测是否支持passive事件绑定
 */
export let passiveSupported = false;
try {
  window.addEventListener(
    "test",
    () => {},
    Object.defineProperty({}, "passive", {
      get: function() {
        passiveSupported = true;
      }
    })
  );
} catch (err) {}

/**
 * 禁用和启用默认滚动
 */
export const defaultScroll = {
  handler(event: TouchEvent) {
    event.preventDefault();
  },
  disable() {
    document.documentElement.addEventListener(
      "touchmove",
      this.handler,
      passiveSupported ? { capture: false, passive: false } : false
    );
  },
  enable() {
    document.documentElement.removeEventListener(
      "touchmove",
      this.handler,
      passiveSupported ? { capture: false } : false
    );
  }
};
