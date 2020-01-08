/** @jsx jsx */
import { jsx, Global, css, Interpolation } from "@emotion/core";
import { useState, useLayoutEffect, useRef } from "react";
import { useWindowResize } from "@clxx/effect";

export interface SelfAdaptionProps {
  // 设计稿尺寸
  designWidth?: number;
  // 移动和非移动的临界尺寸
  criticalWidth?: number;
  // 用户自定义的全局样式
  styles?: Interpolation;
}

/**
 * 适用于移动端的全局自适应组件，推荐使用
 * @param props AdaptiveOption
 */
export function SelfAdaption(props: SelfAdaptionProps): React.ReactElement {
  const { designWidth = 375, criticalWidth = 576, styles } = props;

  /**
   * 获取HTML根元素的计算尺寸
   */
  const computeFontSize = (): number => {
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
    const computeSize = parseFloat(
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
            fontSize: `${baseFontSize}px`,
            touchAction: `manipulation`
          },
          body: {
            // initial在textarea会遇到rem无法生效的bug
            // fontSize: "initial",
            fontSize: "16px",
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
