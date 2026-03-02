import { Global, Interpolation, Theme } from "@emotion/react";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
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

  // 计算理论根字体大小（未经浏览器缩放修正）
  const calculateFontSize = useCallback(
    (width: number): number => {
      const targetWidth = Math.min(Math.max(width, minDocWidth), maxDocWidth);
      return (targetWidth * 100) / designWidth;
    },
    [designWidth, minDocWidth, maxDocWidth]
  );

  // 理论基准字体大小（跟随窗口尺寸变化）
  const [rawFontSize, setRawFontSize] = useState<number>(() =>
    calculateFontSize(window.innerWidth)
  );

  // 浏览器字体缩放因子（>1 表示用户放大了系统字体，<1 表示缩小）
  // 独立存储，使得 resize 后缩放修正依然生效
  const [scaleFactor, setScaleFactor] = useState(1);

  // 是否已完成字体缩放检测
  const [isInitialized, setIsInitialized] = useState(false);

  // 修正后的字体大小：统一对所有字体计算应用缩放修正
  const correctedFontSize = useMemo(
    () =>
      scaleFactor === 1
        ? rawFontSize
        : Math.round((rawFontSize / scaleFactor) * 10) / 10,
    [rawFontSize, scaleFactor]
  );

  // 字体缩放检测
  // Emotion 的 <Global> 通过 useInsertionEffect 注入样式，早于 useLayoutEffect
  // 因此 useLayoutEffect 内 getComputedStyle 可正确读取已注入的字体大小
  // 检测和修正均在浏览器绘制前同步完成，避免闪烁
  useLayoutEffect(() => {
    // 缩放因子在页面生命周期内不变，只需检测一次
    if (isInitialized) return;

    const computedSize = parseFloat(
      window.getComputedStyle(document.documentElement).fontSize
    );

    // 如果计算出的字体大小与期望不符（说明被浏览器字体设置影响了）
    // 容差 1px，避免浮点精度导致误判
    if (computedSize > 0 && Math.abs(computedSize - rawFontSize) > 1) {
      // 记录缩放因子，后续所有字体计算（包括 resize）都会自动应用
      setScaleFactor(computedSize / rawFontSize);
    }
    setIsInitialized(true);
  }, [rawFontSize, isInitialized]);

  // 窗口大小变化时更新理论字体大小
  // correctedFontSize 通过 useMemo 自动应用 scaleFactor 修正
  useWindowResize(() => {
    setRawFontSize(calculateFontSize(window.innerWidth));
  });

  // 设置 viewport meta
  useViewport();

  // 激活 iOS 上的 :active 伪类
  useEffect(() => {
    const noop = () => {};
    document.body.addEventListener("touchstart", noop, { passive: true });
    return () => {
      document.body.removeEventListener("touchstart", noop);
    };
  }, []);

  // 媒体查询边界样式（同样应用缩放修正，与 JS 计算保持一致）
  const mediaQueryStyles = useMemo(() => {
    const correct = (size: number) =>
      scaleFactor === 1
        ? size
        : Math.round((size / scaleFactor) * 10) / 10;

    return {
      [`@media (min-width: ${maxDocWidth}px)`]: {
        html: {
          fontSize: `${correct((100 * maxDocWidth) / designWidth)}px`,
        },
      },
      [`@media (max-width: ${minDocWidth}px)`]: {
        html: {
          fontSize: `${correct((100 * minDocWidth) / designWidth)}px`,
        },
      },
    };
  }, [designWidth, minDocWidth, maxDocWidth, scaleFactor]);

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
              fontSize: `${correctedFontSize}px`,
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
