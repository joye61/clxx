/**
 * 触摸移动事件处理器
 */
const touchMoveHandler = (event: TouchEvent) => {
  event.preventDefault();
};

/**
 * 禁用和启用默认滚动
 *
 * 注意：现代浏览器将 document/documentElement 上的 touchmove 监听器
 * 默认视为 passive: true，此时 preventDefault() 会静默失效。
 * 因此必须显式声明 passive: false 才能真正阻止默认滚动行为。
 */
export const defaultScroll = {
  disable() {
    document.documentElement.addEventListener(
      'touchmove',
      touchMoveHandler,
      { capture: false, passive: false },
    );
  },
  enable() {
    document.documentElement.removeEventListener(
      'touchmove',
      touchMoveHandler,
      { capture: false },
    );
  },
};
