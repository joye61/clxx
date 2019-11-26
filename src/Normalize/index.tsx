/** @jsx jsx */
import { jsx, Global, css, SerializedStyles } from "@emotion/core";
import { useEffect, useState, useLayoutEffect, useRef } from "react";
import { useWindowResize } from "../Effect/useWindowResize";

export interface NormalizeProps {
  // 设计稿尺寸
  designWidth?: number;
  // 移动和非移动的临界尺寸
  criticalWidth?: number;
  // 用户自定义的全局样式
  styles?: SerializedStyles;
}

/**
 * 适用于移动端的全局自适应组件，推荐使用
 * @param props AdaptiveOption
 */
export function Normalize(props: NormalizeProps) {
  const { designWidth = 375, criticalWidth = 576, styles } = props;

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
  const [baseFontSize, setBaseFontSize] = useState<number>(computeFontSize());

  /**
   * scaleRef 设置的目的是为了移除useLayoutEffect的依赖，保证只会被执行一次
   */
  const scaleRef = useRef<() => void>(() => {
    let computeSize = parseFloat(
      window.getComputedStyle(document.documentElement).fontSize
    );

    if (typeof computeSize === "number" && computeSize !== baseFontSize) {
      setBaseFontSize(baseFontSize ** 2 / computeSize);
    }
  });

  /**
   * useLayoutEffect设置的目的是为了防止UI突闪
   */
  useLayoutEffect(scaleRef.current, []);

  /**
   * 监听页面尺寸变化
   */
  useWindowResize(() => setBaseFontSize(() => computeFontSize()));

  return (
    <Global
      styles={[
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
      ]}
    />
  );
}
