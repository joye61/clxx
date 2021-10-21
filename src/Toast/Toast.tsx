/** @jsx jsx */
import { Interpolation, jsx, SerializedStyles, Theme } from "@emotion/react";
import React, { useState, useEffect } from "react";
import { style, getAnimation } from "./style";

export interface ToastProps
  extends Omit<React.HTMLProps<HTMLDivElement>, "content"> {
  // toast消失动画时触发的回调
  onHide?: () => void;
  // toast的内容
  content?: React.ReactNode;
  // toast出现的位置，上|中|下
  position?: "top" | "middle" | "bottom";
  // toast在上时相对于顶部偏移
  offsetTop?: number;
  // toast在下时相对于底部偏移
  offsetBottom?: number;
  // toast持续时间
  duration?: number;
  // 默认toast是否圆角
  radius?: number;
  // 容器样式
  containerStyle?: Interpolation<Theme>;
  // 内容样式
  contentStyle?: Interpolation<Theme>;
}

export function Toast(props: ToastProps) {
  const {
    content = "",
    position = "middle",
    duration = 2000,
    radius = 16,
    offsetTop = 50,
    offsetBottom = 50,
    onHide = () => undefined,
    containerStyle,
    contentStyle,
    ...attributes
  } = props;

  // 初始化显示的动画
  const getResult = getAnimation(position, "show");
  const [animation, setAnimation] = useState<SerializedStyles>(
    getResult.animation
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const { animation } = getAnimation(position, "hide");
      setAnimation(animation);
    }, duration);

    return () => {
      window.clearInterval(timer);
    };
  }, [position]);

  let showContent: any;
  const middleStyle = position === "middle" ? style.contentMiddle : undefined;
  if (React.isValidElement(content)) {
    showContent = <div css={[middleStyle, contentStyle]}>{content}</div>;
  } else {
    showContent = (
      <p css={[style.content(radius), middleStyle, contentStyle]}>{content}</p>
    );
  }

  // toast消失动画结束触发
  const animationEnd = (event: React.AnimationEvent<HTMLDivElement>) => {
    const { keyframes } = getAnimation(position, "hide");
    if (event.animationName === keyframes.name) {
      onHide?.();
    }
  };

  let positionStyle: SerializedStyles;
  if (position === "top") {
    positionStyle = style.top(offsetTop);
  } else if (position === "bottom") {
    positionStyle = style.bottom(offsetBottom);
  } else {
    positionStyle = style.middle;
  }

  return (
    <div
      css={[style.container(), positionStyle, animation, containerStyle]}
      onAnimationEnd={animationEnd}
      {...attributes}
    >
      {showContent}
    </div>
  );
}
