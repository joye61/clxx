/** @jsx jsx */
import { jsx, SerializedStyles } from "@emotion/core";
import React from "react";
import { getStyle, LoadingHide } from "./style";
import { Indicator, IndicatorProps } from "../Indicator";
import { FixContainer, FixContainerProps } from "../Layout/FixContainer";
import { RowCenter } from "../Layout/Flex";

export interface LoadingWrapperProps {
	// loading的状态
	state?: "show" | "hide";
	// 是否有额外信息
	extra?: React.ReactNode;
	// fixcontainer组件的属性
	maskProps?: FixContainerProps;
	// indicator组件的属性
	indicatorProps?: IndicatorProps;
	// 隐藏动画结束时触发
	onHide?: ()=>void;
	// 显示或隐藏动画持续时长
	showHideDuration?: number;
	// 框的圆角尺寸
	radius?: number;
}

export function Wrapper(props: LoadingWrapperProps) {
  const style = getStyle();

  const {
    state = "show",
    extra,
    maskProps = { showMask: false },
    indicatorProps = {
      barWidth: 5,
      barHeight: 25,
      barCount: 14,
		},
		onHide,
		showHideDuration = 200,
		radius = 10,
  } = props;

  // 设置动画逻辑
  let animation: SerializedStyles;
  if (state === "show") {
    animation = style.boxShow(showHideDuration);
  } else {
    animation = style.boxHide(showHideDuration);
  }

	// 动画结束时触发的函数逻辑
  const animationEnd = (event: React.AnimationEvent) => {
		if(event.animationName === LoadingHide.name) {
			onHide?.();
		}
	};

  let box: React.ReactNode;
  if (extra) {
    let extraElement: React.ReactNode;
    if (React.isValidElement(extra)) {
      extraElement = extra;
    } else {
      extraElement = <div css={style.defaultExtra}>{extra}</div>;
    }
    box = (
      <RowCenter
        css={[style.boxCommon(radius), style.boxWithExtra, animation]}
        onAnimationEnd={animationEnd}
      >
        <Indicator {...indicatorProps} />
        {extraElement}
      </RowCenter>
    );
  } else {
    box = (
      <RowCenter
        css={[style.boxCommon(radius), style.box, animation]}
        onAnimationEnd={animationEnd}
      >
        <Indicator {...indicatorProps} />
      </RowCenter>
    );
  }

  return <FixContainer {...maskProps}>{box}</FixContainer>;
}
