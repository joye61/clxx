/**
 * 检测是否支持passive事件绑定
 */
export let passiveSupported = false;
try {
  window.addEventListener(
    'test',
    () => undefined,
    Object.defineProperty({}, 'passive', {
      get: function () {
        passiveSupported = true;
      },
    }),
  );
  // eslint-disable-next-line no-empty
} catch (err) {}

/**
 * 触摸移动事件处理器
 */
const touchMoveHandler = (event: TouchEvent) => {
  event.preventDefault();
};

/**
 * 禁用和启用默认滚动
 */
export const defaultScroll = {
  disable() {
    document.documentElement.addEventListener(
      'touchmove',
      touchMoveHandler,
      passiveSupported ? { capture: false, passive: false } : false,
    );
  },
  enable() {
    document.documentElement.removeEventListener(
      'touchmove',
      touchMoveHandler,
      passiveSupported ? { capture: false } : false,
    );
  },
};
