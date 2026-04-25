import { css, Interpolation, Theme } from "@emotion/react";
import { HTMLAttributes, useMemo } from "react";
import * as CSS from "csstype";
import { normalizeUnit } from "../utils/cssUtil";
import { barFadeKeyframes } from "./style";

export interface IndicatorProps extends HTMLAttributes<HTMLDivElement> {
  // 容器的尺寸
  size?: CSS.Property.Width | number;
  // bar 是否圆角，默认：true
  rounded?: boolean;
  // bar 宽度（100x100 viewBox 下的相对单位），默认：8
  barWidth?: number;
  // bar 高度（100x100 viewBox 下的相对单位），默认：26
  barHeight?: number;
  // bar 颜色，默认：#8e8e93（iOS systemGray）
  barColor?: string;
  // bar 个数，默认：12（iOS 标准）
  barCount?: number;
  // 每转一圈的持续时间，单位毫秒，默认：1000ms
  duration?: number;
  // 容器样式
  containerStyle?: Interpolation<Theme>;
}

/**
 * iOS 风菊花转圈指示器（仿 UIActivityIndicatorView 节奏）。
 * 性能要点：
 *  - 用 opacity 动画替代 fill 动画，触发 GPU 合成而非 SVG paint
 *  - keyframes 全局单例，颜色/时长变化不会污染样式表
 *  - animation-delay 走 inline style，emotion 不再为每条 bar 生成独立类名
 */
export function Indicator(props: IndicatorProps) {
  const {
    size,
    rounded = true,
    barWidth = 8,
    barHeight = 26,
    barColor = "#ffffff",
    barCount = 12,
    duration = 1000,
    containerStyle,
    ...attributes
  } = props;

  const radius = rounded ? barWidth / 2 : 0;

  const containerCss = useMemo<Interpolation<Theme>>(
    () => [
      { fontSize: 0, display: "inline-block", lineHeight: 0 },
      size !== undefined
        ? { width: normalizeUnit(size), height: normalizeUnit(size) }
        : { width: ".4rem", height: ".4rem" },
    ],
    [size],
  );

  const svgCss = useMemo(
    () =>
      css({
        width: "100%",
        height: "100%",
        display: "block",
        rect: {
          fill: barColor,
          animationName: `${barFadeKeyframes}`,
          animationDuration: `${duration}ms`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          willChange: "opacity",
        },
      }),
    [barColor, duration],
  );

  const bars = useMemo(() => {
    const list = [];
    const x = (100 - barWidth) / 2;
    for (let i = 0; i < barCount; i++) {
      list.push(
        <rect
          key={i}
          x={x}
          y={0}
          rx={radius}
          ry={radius}
          width={barWidth}
          height={barHeight}
          transform={`rotate(${(360 / barCount) * i} 50 50)`}
          // 负 delay：组件挂载即处于稳态动画中，不会先停后转
          style={{
            animationDelay: `${-(duration * (barCount - i)) / barCount}ms`,
          }}
        />,
      );
    }
    return list;
  }, [barCount, barWidth, barHeight, radius, duration]);

  return (
    <div css={[containerCss, containerStyle]} {...attributes}>
      <svg viewBox="0 0 100 100" css={svgCss} aria-hidden="true">
        {bars}
      </svg>
    </div>
  );
}

