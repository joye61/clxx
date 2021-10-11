/** @jsx jsx */
import { jsx, Global, css, Interpolation, Theme } from "@emotion/react";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ContextValue, getContextValue } from "../context";
import { useWindowResize } from "../effect/useWindowResize";

export interface ContainerProps extends ContextValue {
  // 用户自定义的全局样式
  style?: Interpolation<Theme>;
  // 容器包裹的子元素
  children?: React.ReactNode;
}

/**
 * 自适应容器
 * @param props
 */
export function Container(props: ContainerProps) {
  const ctx = getContextValue() as ContextValue;
  // 获取环境变量
  const {
    designWidth = ctx.designWidth,
    minScreenWidth = ctx.minScreenWidth,
    maxScreenWidth = ctx.maxScreenWidth,
    style,
    children,
  } = props;

  // 获取期待的根字体尺寸，采用rem布局
  const expectFontSize = useCallback(() => {
    const winWidth = window.innerWidth;
    let expectFontSize: number;
    if (winWidth >= maxScreenWidth) {
      expectFontSize = (maxScreenWidth * 100) / designWidth;
    } else if (winWidth <= minScreenWidth) {
      expectFontSize = (minScreenWidth * 100) / designWidth;
    } else {
      expectFontSize = (winWidth * 100) / designWidth;
    }
    return expectFontSize;
  }, [designWidth, minScreenWidth, maxScreenWidth]);

  // 基准字体尺寸
  const [baseFontSize, setBaseFontSize] = useState<number>(expectFontSize());

  // 移除useLayoutEffect的依赖，保证只会被执行一次
  const scaleRef = useRef<() => void>(() => {
    let computeSize = parseFloat(
      window.getComputedStyle(document.documentElement).fontSize
    );

    if (typeof computeSize === "number" && computeSize !== baseFontSize) {
      setBaseFontSize(baseFontSize ** 2 / computeSize);
    }
  });

  // 防止UI突闪
  useLayoutEffect(() => {
    scaleRef.current();
    // 激活iOS上的:active
    const activable = () => {};
    document.body.addEventListener("touchstart", activable);
    return () => {
      document.body.removeEventListener("touchstart", activable);
    };
  }, []);

  // 页面大小变化时，基准字体同步变化
  useWindowResize(() => setBaseFontSize(() => expectFontSize()));

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
              lineHeight: 1.15,
            },
            body: {
              fontSize: "16px",
              margin: "0 auto",
              maxWidth: `${maxScreenWidth}px`,
              minWidth: `${minScreenWidth}px`,
            },
            [`@media (min-width: ${maxScreenWidth}px)`]: {
              html: {
                fontSize: `${(100 * maxScreenWidth) / designWidth}px`,
              },
            },
            [`@media (max-width: ${minScreenWidth}px)`]: {
              html: {
                fontSize: `${(100 * minScreenWidth) / designWidth}px`,
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
