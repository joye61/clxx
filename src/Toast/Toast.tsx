/** @jsx jsx */
import { jsx, SerializedStyles } from "@emotion/core";
import React, { useState, useEffect } from "react";
import { getStyle, hideAnimation } from "./style";

export interface ToastProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
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
  rounded?: boolean;
}

export function Toast(props: ToastProps) {
  const {
    content = "",
    position = "middle",
    duration = 3000,
    rounded = true,
    offsetTop = 30,
    offsetBottom = 30,
    onHide = () => undefined,
    ...attributes
  } = props;

  // 获取所有的样式
  const style = getStyle();

  const [animation, setAnimation] = useState<SerializedStyles>(
    style.containerShow
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAnimation(style.containerHide);
    }, duration);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  let showContent: any;
  const middleStyle = position === "middle" ? style.contentMiddle : undefined;
  if (React.isValidElement(content)) {
    showContent = <div css={middleStyle}>{content}</div>;
  } else {
    showContent = <p css={[style.content(rounded), middleStyle]}>{content}</p>;
  }

  // toast消失动画结束触发
  const animationEnd = (event: React.AnimationEvent<HTMLDivElement>) => {
    if (event.animationName === hideAnimation.name) {
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
      css={[style.container, positionStyle, animation]}
      onAnimationEnd={animationEnd}
      {...attributes}
    >
      {showContent}
    </div>
  );
}
