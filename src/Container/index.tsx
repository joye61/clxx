import { Global, Interpolation, Theme } from "@emotion/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ContextValue, getContextValue } from "../context";
import { useWindowResize } from "../Effect/useWindowResize";
import { useViewport } from "../Effect/useViewport";

export interface ContainerProps {
  // 用户自定义的全局样式
  globalStyle?: Interpolation<Theme>;
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
  const { designWidth = 750, globalStyle, children } = props;

  // 计算根字体尺寸的函数（使用 useCallback 避免重复创建）
  const calculateFontSize = useCallback(
    (width: number): number => {
      let targetWidth = width;
      if (width >= maxDocWidth) {
        targetWidth = maxDocWidth;
      } else if (width <= minDocWidth) {
        targetWidth = minDocWidth;
      }
      return (targetWidth * 100) / designWidth;
    },
    [designWidth, minDocWidth, maxDocWidth]
  );

  // 基准字体尺寸（初始化时计算一次）
  const [baseFontSize, setBaseFontSize] = useState<number>(() =>
    calculateFontSize(window.innerWidth)
  );

  // 是否已完成初始化（包括字体缩放修正）
  const [isInitialized, setIsInitialized] = useState(false);

  // 字体缩放修正逻辑（处理浏览器字体设置影响）
  // 使用 useLayoutEffect 在 DOM 更新后立即同步执行，避免闪烁
  useEffect(() => {
    // 只在未初始化时检查一次
    if (isInitialized) return;

    // 延迟到下一帧检查，确保 DOM 已经应用了 baseFontSize
    requestAnimationFrame(() => {
      const computedSize = parseFloat(
        window.getComputedStyle(document.documentElement).fontSize
      );

      // 如果计算出的字体大小与期望不符（说明被浏览器字体设置影响了）
      // 使用较大的容差值，避免浮点数精度问题导致的无限循环
      if (
        typeof computedSize === "number" &&
        computedSize > 0 &&
        Math.abs(computedSize - baseFontSize) > 1 // 容差 1px，避免过度敏感
      ) {
        // 计算浏览器的字体缩放比例
        const scaleFactor = computedSize / baseFontSize;

        // 通过反向缩放修正字体大小
        // 例如：期望 50px，实际 60px（1.2倍），则设置 50/1.2 ≈ 41.67px
        const correctedSize =
          Math.round((baseFontSize / scaleFactor) * 10) / 10;

        // 只修正一次，然后标记为已初始化
        setBaseFontSize(correctedSize);
        setIsInitialized(true);
      } else {
        // 字体大小正确，直接标记为已初始化
        setIsInitialized(true);
      }
    });
  }, [baseFontSize, isInitialized]);

  // 页面大小变化时，基准字体同步变化
  // 使用 requestAnimationFrame 批量处理，避免频繁更新
  useWindowResize(() => {
    requestAnimationFrame(() => {
      const newFontSize = calculateFontSize(window.innerWidth);
      if (newFontSize !== baseFontSize) {
        setBaseFontSize(newFontSize);
      }
    });
  });

  // 设置meta, 确保viewport的合法逻辑
  useViewport();

  // 页面初始化逻辑
  useEffect(() => {
    // 激活iOS上的:active伪类
    const activable = () => {};
    document.body.addEventListener("touchstart", activable, { passive: true });

    return () => {
      document.body.removeEventListener("touchstart", activable);
    };
  }, []);

  // 使用 useMemo 缓存媒体查询样式，避免每次渲染都重新计算
  const mediaQueryStyles = useMemo(
    () => ({
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
    [designWidth, minDocWidth, maxDocWidth]
  );

  return (
    <React.Fragment>
      <Global
        styles={[
          {
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
            ...mediaQueryStyles,
          },
          globalStyle,
        ]}
      />
      {isInitialized ? children : null}
    </React.Fragment>
  );
}
