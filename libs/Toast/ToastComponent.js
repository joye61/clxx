"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
function ToastComponent(_a) {
    var content = _a.content, _b = _a.duration, duration = _b === void 0 ? 3000 : _b, _c = _a.onEnd, onEnd = _c === void 0 ? function () { } : _c;
    var _d = react_1.useState("cl-Toast cl-Toast-show"), animationClass = _d[0], setAnimationClass = _d[1];
    // 约定时间之后自动清理Toast
    react_1.useEffect(function () {
        var timer = window.setTimeout(function () {
            setAnimationClass("cl-Toast cl-Toast-hide");
        }, duration);
        (function () {
            window.clearTimeout(timer);
        });
    });
    // 动画结束时执行
    var animationEnd = function (event) {
        if (event.animationName === "cl-Toast-hide") {
            typeof onEnd === "function" && onEnd();
        }
    };
    return (react_1.default.createElement("div", { className: animationClass, onAnimationEnd: animationEnd }, content));
}
exports.ToastComponent = ToastComponent;
