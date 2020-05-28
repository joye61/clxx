import {
  isArray,
  isArrayLikeObject,
  isElement,
  isEmpty,
  isPlainObject,
  isFunction,
  isEqual,
  isBoolean,
  isArrayBuffer,
  isArguments,
  isArrayLike,
  isBuffer,
  isDate,
  isEqualWith,
  isError,
  isFinite,
  isInteger,
  isMap,
  isNaN,
  isNative,
  isNil,
  isNull,
  isNumber,
  isObject,
  isObjectLike,
  isRegExp,
  isSafeInteger,
  isSet,
  isString,
  isSymbol,
  isTypedArray,
  isUndefined,
  isWeakMap,
  isWeakSet,
} from 'lodash';

// 来自lodash的判断
const lodashIs = {
  isArray,
  isArrayLikeObject,
  isElement,
  isEmpty,
  isPlainObject,
  isFunction,
  isEqual,
  isBoolean,
  isArrayBuffer,
  isArguments,
  isArrayLike,
  isBuffer,
  isDate,
  isEqualWith,
  isError,
  isFinite,
  isInteger,
  isMap,
  isNaN,
  isNative,
  isNil,
  isNull,
  isNumber,
  isObject,
  isObjectLike,
  isRegExp,
  isSafeInteger,
  isSet,
  isString,
  isSymbol,
  isTypedArray,
  isUndefined,
  isWeakMap,
  isWeakSet,
};

/**
 * 一些简单的判断逻辑
 */
const extraIs = {
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

/**
 * 简单条件判断
 */
export const is = {
  ...lodashIs,
  ...extraIs,
};
