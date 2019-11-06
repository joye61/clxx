import { isArray, isBoolean, isElement, isEmpty, isEqual, isError, isFunction, isNumber, isPlainObject, isString, isSymbol, isUndefined, isNull, isRegExp } from "lodash";
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
    null: isNull,
    regexp: isRegExp
};
export const is = Object.assign(Object.assign({}, isType), { android() {
        return /Android/i.test(window.navigator.userAgent);
    },
    ios() {
        return /iPhone|iPad/i.test(window.navigator.userAgent);
    },
    weixin() {
        return /MicroMessenger/i.test(window.navigator.userAgent);
    },
    QQ() {
        return /QQ/i.test(window.navigator.userAgent);
    },
    iphoneX() {
        return (/iPhone/gi.test(window.navigator.userAgent) && window.screen.height >= 812);
    },
    touchable() {
        return !this.undefined(window.ontouchstart);
    } });
