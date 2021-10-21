/** @jsx jsx */
import { jsx, css, Interpolation, Theme } from "@emotion/react";
import React from "react";
import * as CSS from "csstype";
import { adaptive, normalizeUnit } from "../utils/cssUtil";
import { getBarChangeKeyFrames } from "./style";

export interface IndicatorProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  // 容器的尺寸
  size?: CSS.Property.Width | number;
  // bar是否圆角，默认：true
  rounded?: boolean;
  // bar宽度，默认：7
  barWidth?: number;
  // bar高度，默认：26
  barHeight?: number;
  // bar颜色，默认：#fff
  barColor?: string;
  // bar个数，默认：12
  barCount?: number;
  // 每转一圈的持续时间，单位毫秒，默认：500ms
  duration?: number;
  // 容器样式
  containerStyle?: Interpolation<Theme>;
}

/**
 * SVG转圈指示器，一般用作loading效果
 * @param props
 */
export function Indicator(props: IndicatorProps) {
  const {
    size,
    rounded = true,
    barWidth = 7,
    barHeight = 28,
    barColor = "#fff",
    barCount = 12,
    duration = 600,
    containerStyle,
    ...attributes
  } = props;

  const radius = rounded ? barWidth / 2 : 0;

  const barList = [];
  for (let i = 0; i < barCount; i++) {
    barList.push(
      <rect
        key={i}
        x={(100 - barWidth) / 2}
        y="0"
        rx={radius}
        ry={radius}
        width={barWidth}
        height={barHeight}
        transform={`rotate(${(360 / barCount) * i}, 50, 50)`}
        css={{
          animationDelay: `${-(duration * (barCount - i)) / barCount}ms`,
        }}
      />
    );
  }

  const style: Interpolation<Theme> = [
    {
      fontSize: 0,
    },
  ];
  if (typeof size !== "undefined") {
    const unitSize = normalizeUnit(size);
    style.push({
      width: unitSize,
      height: unitSize,
    });
  } else {
    // 容器尺寸未传时，这里是默认的尺寸
    style.push(
      adaptive({
        width: 60,
        height: 60,
      })
    );
  }
  const svgStyle = css({
    width: "100%",
    height: "100%",
    rect: {
      fill: "transparent",
      animationName: getBarChangeKeyFrames(barColor),
      animationDuration: `${duration}ms`,
      animationTimingFunction: "linear",
      animationIterationCount: "infinite",
    },
  });

  return (
    <div css={[style, containerStyle]} {...attributes}>
      <svg viewBox="0 0 100 100" css={svgStyle}>
        {barList}
      </svg>
    </div>
  );
}
