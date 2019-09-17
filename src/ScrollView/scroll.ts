/**
 * 禁用和启用默认滚动
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

export const scroll = {
  handler(event: TouchEvent) {
    event.preventDefault();
  },
  stop() {
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
