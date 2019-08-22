"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/** @jsx jsx */
var core_1 = require("@emotion/core");
var react_1 = __importStar(require("react"));
var style_1 = require("./style");
function ToastComponent(_a) {
    var content = _a.content, _b = _a.position, position = _b === void 0 ? "bottom" : _b, _c = _a.duration, duration = _c === void 0 ? 3000 : _c, _d = _a.onEnd, onEnd = _d === void 0 ? function () { } : _d;
    var _e = react_1.useState(style_1.style.containerShow), animation = _e[0], setAnimation = _e[1];
    react_1.useEffect(function () {
        var timer = window.setTimeout(function () {
            setAnimation(style_1.style.containerHide);
        }, duration);
        return function () {
            window.clearInterval(timer);
        };
    }, []);
    var showContent;
    if (react_1.default.isValidElement(content)) {
        showContent = content;
    }
    else {
        showContent = core_1.jsx("p", { css: style_1.style.content }, content);
    }
    var animationEnd = function (event) {
        if (event.animationName === style_1.hideAnimation.name) {
            typeof onEnd === "function" && onEnd();
        }
    };
    return (core_1.jsx("div", { css: [style_1.style.container, style_1.style[position], animation], onAnimationEnd: animationEnd }, showContent));
}
exports.ToastComponent = ToastComponent;
