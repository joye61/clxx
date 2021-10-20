/** @jsx jsx */
import { jsx, Global, css, Interpolation, Theme } from "@emotion/react";
import React, { useCallback, useEffect, useState } from "react";
import { ContextValue, getContextValue } from "../context";
import { useWindowResize } from "../effect/useWindowResize";
import round from "lodash/round";
import { useViewport } from "../effect/useViewport";

export interface ContainerProps {
  // 用户自定义的全局样式
  style?: Interpolation<Theme>;
  // 容器包裹的子元素
  children?: React.ReactNode;
  // 设计尺寸
  designWidth?: number;
}

/**
 * 自适应容器
 * @param props
 */
export function Container(props: ContainerProps) {
  // 来自全局的环境变量
  const { minDocWidth, maxDocWidth } = getContextValue() as ContextValue;
  // 获取环境变量
  const { designWidth = 750, style, children } = props;

  // 获取期待的根字体尺寸，采用rem布局
  const expectFontSize = useCallback(() => {
    const winWidth = window.innerWidth;
    let expectFontSize: number;
    if (winWidth >= maxDocWidth) {
      expectFontSize = (maxDocWidth * 100) / designWidth;
    } else if (winWidth <= minDocWidth) {
      expectFontSize = (minDocWidth * 100) / designWidth;
    } else {
      expectFontSize = (winWidth * 100) / designWidth;
    }
    return expectFontSize;
  }, [designWidth, minDocWidth, maxDocWidth]);

  // 基准字体尺寸
  const [baseFontSize, setBaseFontSize] = useState<number>(expectFontSize());
  // 页面大小变化时，基准字体同步变化
  useWindowResize(() => setBaseFontSize(() => expectFontSize()));

  // 字体缩放逻辑
  const scaleFont = useCallback<() => void>(() => {
    let computeSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    if (typeof computeSize === "number" && computeSize !== baseFontSize) {
      setBaseFontSize(round(baseFontSize ** 2 / computeSize, 1));
    }
  }, [baseFontSize]);
  // 字体更新时，同步更新缩放逻辑
  useEffect(scaleFont, [scaleFont]);

  // 设置meta, 确保viewport的合法逻辑
  useViewport();

  // 一些页面的初始化逻辑
  useEffect(() => {
    // 激活iOS上的:active
    const activable = () => {};
    document.body.addEventListener("touchstart", activable);
    return () => {
      document.body.removeEventListener("touchstart", activable);
    };
  }, []);

  return (
    <React.Fragment>
      <Global
        styles={[
          css({
            "*": {
              boxSizing: "border-box",
            },
            html: {
              WebkitTapHighlightColor: "transparent",
              WebkitOverflowScrolling: "touch",
              WebkitTextSizeAdjust: "100%",
              fontSize: `${baseFontSize}px`,
              touchAction: "manipulation",
            },
            body: {
              fontSize: "16px",
              margin: "0 auto",
              maxWidth: `${maxDocWidth}px`,
              minWidth: `${minDocWidth}px`,
            },
            [`@media (min-width: ${maxDocWidth}px)`]: {
              html: {
                fontSize: `${(100 * maxDocWidth) / designWidth}px`,
              },
            },
            [`@media (max-width: ${minDocWidth}px)`]: {
              html: {
                fontSize: `${(100 * minDocWidth) / designWidth}px`,
              },
            },
          }),
          style,
        ]}
      />
      {children}
    </React.Fragment>
  );
}
