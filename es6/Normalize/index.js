/** @jsx jsx */
import { jsx, Global, css } from "@emotion/core";
import { useEffect, useState, useLayoutEffect, useRef } from "react";
/**
 * 适用于移动端的全局自适应组件，推荐使用
 * @param props AdaptiveOption
 */
export function Normalize(props) {
    const { designWidth = 375, criticalWidth = 769, styles } = props;
    /**
     * 获取HTML根元素的计算尺寸
     */
    const computeFontSize = () => {
        const windowWidth = window.innerWidth;
        const usedSize = windowWidth > criticalWidth ? criticalWidth : windowWidth;
        return (usedSize * 100) / designWidth;
    };
    /**
     * 最终的基准字体尺寸
     */
    const [baseFontSize, setBaseFontSize] = useState(computeFontSize());
    /**
     * scaleRef 设置的目的是为了移除useLayoutEffect的依赖，保证只会被执行一次
     */
    const scaleRef = useRef(() => {
        let computeSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
        if (typeof computeSize === "number" && computeSize !== baseFontSize) {
            setBaseFontSize(Math.pow(baseFontSize, 2) / computeSize);
        }
    });
    /**
     * useLayoutEffect设置的目的是为了防止UI突闪
     */
    useLayoutEffect(scaleRef.current, []);
    /**
     * 监听页面尺寸变化
     */
    useEffect(() => {
        const onresize = () => {
            setBaseFontSize(() => computeFontSize());
        };
        window.addEventListener("resize", onresize);
        if (window.onorientationchange !== undefined) {
            window.addEventListener("orientationchange", onresize);
        }
        return () => {
            window.removeEventListener("resize", onresize);
            if (window.onorientationchange !== undefined) {
                window.removeEventListener("orientationchange", onresize);
            }
        };
    }, [designWidth, criticalWidth]);
    return (jsx(Global, { styles: [
            css({
                "*": {
                    boxSizing: "border-box"
                },
                html: {
                    WebkitTapHighlightColor: "transparent",
                    WebkitOverflowScrolling: "touch",
                    WebkitTextSizeAdjust: "100%",
                    fontSize: `${baseFontSize}px`
                },
                body: {
                    fontSize: "initial",
                    margin: "0 auto",
                    maxWidth: `${criticalWidth}px`
                },
                [`@media screen and (min-width: ${criticalWidth}px)`]: {
                    html: {
                        fontSize: `${(100 * criticalWidth) / designWidth}px`
                    }
                }
            }),
            styles
        ] }));
}
