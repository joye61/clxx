"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var isPlainObject_1 = __importDefault(require("lodash/isPlainObject"));
function rem(option) {
    // 设计尺寸，在html根元素指定data-dw
    var dw = document.documentElement.dataset.dw;
    var config = {
        criticalWidth: 576,
        designWidth: dw ? parseInt(dw) : 750 // 设计尺寸
    };
    // 参数和默认选项合并
    if (typeof option === "number") {
        config.designWidth = option;
    }
    if (isPlainObject_1.default(option)) {
        config = __assign({}, config, option);
    }
    var reset = function () {
        var fontSize = window.innerWidth <= config.criticalWidth
            ? (window.innerWidth * 100) / config.designWidth + "px"
            : (config.criticalWidth * 100) / config.designWidth + "px";
        document.documentElement.style.fontSize = fontSize;
    };
    window.onresize = reset;
    if (window.onorientationchange !== undefined) {
        window.onorientationchange = reset;
    }
    reset();
}
exports.rem = rem;
