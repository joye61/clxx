import isArray from "lodash/isArray";
import isElement from "lodash/isElement";
import isPlainObject from "lodash/isPlainObject";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";

// 来自lodash的判断
const lodashIs = {
  isArray,
  isElement,
  isPlainObject,
  isEqual,
  isEmpty,
};

/**
 * 一些简单的判断逻辑
 */
export const is = {
  ...lodashIs,
  isAndroid(): boolean {
    return /Android/i.test(window.navigator.userAgent);
  },
  isIOS(): boolean {
    return /iPhone|iPad/i.test(window.navigator.userAgent);
  },
  isWeixin(): boolean {
    return /MicroMessenger/i.test(window.navigator.userAgent);
  },
  isQQ(): boolean {
    return /QQ/i.test(window.navigator.userAgent);
  },
  isIphoneX(): boolean {
    return (
      /iPhone/gi.test(window.navigator.userAgent) && window.screen.height >= 812
    );
  },
  isTouchable() {
    return window.ontouchstart !== undefined;
  },
};
