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
import React, { useState, useEffect } from "react";
import { style, hideAnimation } from "./style";
export function Toast(props) {
    const { content, position = "middle", duration = 3000, rounded = true, onEnd = () => { } } = props, htmlProps = __rest(props, ["content", "position", "duration", "rounded", "onEnd"]);
    const [animation, setAnimation] = useState(style.containerShow);
    useEffect(() => {
        const timer = window.setTimeout(() => {
            setAnimation(style.containerHide);
        }, duration);
        return () => {
            window.clearInterval(timer);
        };
    }, []);
    let showContent;
    if (React.isValidElement(content)) {
        showContent = content;
    }
    else {
        showContent = (jsx("p", { className: "cl-Toast-content", css: style.content(rounded) }, content));
    }
    const animationEnd = (event) => {
        if (event.animationName === hideAnimation.name) {
            typeof onEnd === "function" && onEnd();
        }
    };
    return (jsx("div", Object.assign({ css: [style.container, style[position], animation], onAnimationEnd: animationEnd }, htmlProps), showContent));
}
