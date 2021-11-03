/** @jsx jsx */
import { jsx, Interpolation, Theme } from "@emotion/react";
import React from "react";
import { style, LoadingHide } from "./style";
import { Indicator, IndicatorProps } from "../Indicator";
import { RowCenter } from "../Flex/Row";
import { Overlay, OverlayProps } from "../Overlay";

export interface LoadingWrapperProps {
  // loading的状态
  status?: "show" | "hide";
  // 是否有额外信息
  hint?: React.ReactNode;
  // fixcontainer组件的属性
  overlay?: OverlayProps;
  // indicator组件的属性
  indicator?: IndicatorProps;
  // 隐藏动画结束时触发
  onHide?: () => void;
  // 容器样式
  containerStyle?: Interpolation<Theme>;
}

export function Wrapper(props: LoadingWrapperProps) {
  const {
    status = "show",
    hint,
    overlay,
    indicator,
    onHide,
    containerStyle,
  } = props;

  // 覆盖层样式
  let overlayProps: OverlayProps = {
    centerContent: true,
    fullScreen: true,
    maskColor: "transparent",
  };
  if (typeof overlay === "object") {
    overlayProps = { ...overlayProps, ...overlay };
  }

  // 指示器样式
  let indicatorProps: IndicatorProps = {
    barWidth: 5,
    barHeight: 25,
    barCount: 14,
  };
  if (typeof indicator === "object") {
    indicatorProps = { ...indicatorProps, ...indicator };
  }

  // 根据状态设置动画
  const animation = status === "show" ? style.boxShow : style.boxHide;
  // 动画结束时触发的函数逻辑
  const animationEnd = (event: React.AnimationEvent) => {
    if (event.animationName === LoadingHide.name) {
      onHide?.();
    }
  };

  let box: React.ReactNode;
  if (hint && typeof hint === "string") {
    box = (
      <RowCenter
        css={[style.boxCommon, style.boxWithExtra, animation, containerStyle]}
        onAnimationEnd={animationEnd}
      >
        <Indicator {...indicatorProps} />
        <div css={style.hint}>{hint}</div>
      </RowCenter>
    );
  } else {
    box = (
      <RowCenter
        css={[style.boxCommon, style.box, animation, containerStyle]}
        onAnimationEnd={animationEnd}
      >
        <Indicator {...indicatorProps} />
      </RowCenter>
    );
  }

  return <Overlay {...overlayProps}>{box}</Overlay>;
}
