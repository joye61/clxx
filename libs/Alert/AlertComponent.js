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
function AlertComponent(_a) {
    var _b = _a.content, content = _b === void 0 ? "" : _b, _c = _a.showMask, showMask = _c === void 0 ? true : _c, _d = _a.showCancel, showCancel = _d === void 0 ? false : _d, _e = _a.cancelText, cancelText = _e === void 0 ? "取消" : _e, _f = _a.confirmText, confirmText = _f === void 0 ? "确定" : _f, _g = _a.onConfirm, onConfirm = _g === void 0 ? function () { } : _g, _h = _a.onCancel, onCancel = _h === void 0 ? function () { } : _h, _j = _a.onHide, onHide = _j === void 0 ? function () { } : _j;
    // 动画状态类
    var _k = react_1.useState(style_1.style.containerShow), animation = _k[0], setAnimation = _k[1];
    // 动画结束回调
    var animationEnd = function (event) {
        if (style_1.hideAnimation.name === event.animationName) {
            typeof onHide === "function" && onHide();
        }
    };
    // 取消按钮点击
    var cancel = function () {
        setAnimation(style_1.style.containerHide);
        typeof onCancel === "function" && onCancel();
    };
    // 确认按钮点击
    var confirm = function () {
        setAnimation(style_1.style.containerHide);
        typeof onConfirm === "function" && onConfirm();
    };
    // 显示弹框内容
    var showContent = function () {
        if (typeof content === "string") {
            return core_1.jsx("p", { css: style_1.style.content }, content);
        }
        if (react_1.default.isValidElement(content)) {
            return content;
        }
    };
    var wrapperCss = [style_1.style.alert];
    if (showMask) {
        wrapperCss.push(style_1.style.alertMask);
    }
    return (core_1.jsx("div", { css: wrapperCss },
        core_1.jsx("div", { css: [style_1.style.container, animation], onAnimationEnd: animationEnd },
            showContent(),
            core_1.jsx("div", { css: style_1.style.btn },
                showCancel ? (core_1.jsx("div", { css: style_1.style.cancel, onClick: cancel, onTouchStart: function () { } }, cancelText)) : null,
                core_1.jsx("div", { css: style_1.style.confirm, onClick: confirm, onTouchStart: function () { } }, confirmText)))));
}
exports.AlertComponent = AlertComponent;
