var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useState } from "react";
import { style, hideAnimation } from "./style";
export function Alert(props) {
    const { content, showMask = true, showCancel = false, showConfirm = true, cancelContent = "取消", confirmContent = "确定", onConfirm = () => { }, onCancel = () => { }, onHide = () => { } } = props, htmlProps = __rest(props, ["content", "showMask", "showCancel", "showConfirm", "cancelContent", "confirmContent", "onConfirm", "onCancel", "onHide"]);
    // 动画状态类
    const [animation, setAnimation] = useState(style.containerShow);
    // 动画结束回调
    const animationEnd = (event) => {
        if (hideAnimation.name === event.animationName) {
            typeof onHide === "function" && onHide();
        }
    };
    // 取消按钮点击
    const cancel = () => {
        setAnimation(style.containerHide);
        typeof onCancel === "function" && onCancel();
    };
    // 确认按钮点击
    const confirm = () => {
        setAnimation(style.containerHide);
        typeof onConfirm === "function" && onConfirm();
    };
    // 显示弹框内容
    let showContent;
    if (React.isValidElement(content)) {
        showContent = content;
    }
    else {
        showContent = (jsx("p", { css: style.content, className: "cl-Alert-content" }, content));
    }
    const wrapperCss = [style.alert];
    if (showMask) {
        wrapperCss.push(style.alertMask);
    }
    /**
     * 显示取消按钮
     */
    const cancelBtn = () => {
        if (!showCancel) {
            return null;
        }
        if (React.isValidElement(cancelContent)) {
            return cancelContent;
        }
        return (jsx("div", { css: [style.btnItem, style.cancel], onClick: cancel, className: "cl-Alert-btn-cancel", onTouchStart: () => { } }, cancelContent));
    };
    /**
     * 显示确定按钮
     */
    const confirmBtn = () => {
        if (!showConfirm) {
            return null;
        }
        if (React.isValidElement(confirmContent)) {
            return confirmContent;
        }
        return (jsx("div", { css: [style.btnItem, style.confirm], className: "cl-Alert-btn-confirm", onClick: confirm, onTouchStart: () => { } }, confirmContent));
    };
    const showBtn = () => {
        if (!showCancel && !showConfirm) {
            return null;
        }
        return (jsx("div", { css: style.btn, className: "cl-Alert-btn" },
            cancelBtn(),
            confirmBtn()));
    };
    return (jsx("div", Object.assign({ css: wrapperCss }, htmlProps),
        jsx("div", { className: "cl-Alert-container", css: [style.container, animation], onAnimationEnd: animationEnd },
            showContent,
            showBtn())));
}
