/**
 * 一些简单的判断逻辑
 */
export const is = {
  android(): boolean {
    return /Android/i.test(window.navigator.userAgent);
  },
  ios(): boolean {
    return /iPhone|iPad/i.test(window.navigator.userAgent);
  },
  weixin(): boolean {
    return /MicroMessenger/i.test(window.navigator.userAgent);
  },
  QQ(): boolean {
    return /QQ/i.test(window.navigator.userAgent);
  },
  iphoneX(): boolean {
    return (
      /iPhone/gi.test(window.navigator.userAgent) && window.screen.height >= 812
    );
  },
  touchable() {
    return window.ontouchstart !== undefined;
  }
};
