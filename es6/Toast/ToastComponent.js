/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useState, useEffect } from "react";
import { style, hideAnimation } from "./style";
export function ToastComponent({ content, position = "bottom", duration = 3000, rounded = false, onEnd = () => { } }) {
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
        showContent = jsx("p", { css: style.content(rounded) }, content);
    }
    const animationEnd = (event) => {
        if (event.animationName === hideAnimation.name) {
            typeof onEnd === "function" && onEnd();
        }
    };
    return (jsx("div", { css: [style.container, style[position], animation], onAnimationEnd: animationEnd }, showContent));
}
