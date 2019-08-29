import {
  isArray,
  isBoolean,
  isElement,
  isEmpty,
  isEqual,
  isError,
  isFunction,
  isNumber,
  isPlainObject,
  isString,
  isSymbol,
  isUndefined,
  isNull
} from "lodash";

const isType = {
  array: isArray,
  boolean: isBoolean,
  element: isElement,
  empty: isEmpty,
  deepEqual: isEqual,
  error: isError,
  function: isFunction,
  number: isNumber,
  plainObject: isPlainObject,
  string: isString,
  symbol: isSymbol,
  undefined: isUndefined,
  null: isNull
};

export const is = {
  ...isType,
  anroid(): boolean {
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
    return !this.undefined(window.ontouchstart);
  }
};
