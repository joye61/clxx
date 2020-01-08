/**
 * 检测是否支持passive事件绑定
 */
export let passiveSupported = false;
try {
  window.addEventListener(
    "test",
    () => undefined,
    Object.defineProperty({}, "passive", {
      get: function() {
        passiveSupported = true;
      }
    })
  );
  // eslint-disable-next-line no-empty
} catch (err) {}

/**
 * 禁用和启用默认滚动
 */
export const nativeScroll = {
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
