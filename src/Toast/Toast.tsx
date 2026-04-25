import { Interpolation, SerializedStyles, Theme } from "@emotion/react";
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
  // 默认圆角值
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
      window.clearTimeout(timer);
    };
  }, [position, duration]);

  let showContent: any;
  const middleStyle = position === "middle" ? style.contentMiddle : undefined;
  if (React.isValidElement(content)) {
    showContent = <div css={[middleStyle, contentStyle]}>{content}</div>;
  } else {
    showContent = (
      <p
        css={[style.content, middleStyle, contentStyle]}
        style={{ borderRadius: radius ? radius / 100 + "rem" : 0 }}
      >
        {content}
      </p>
    );
  }

  // toast消失动画结束触发
  const animationEnd = (event: React.AnimationEvent<HTMLDivElement>) => {
    const { keyframes } = getAnimation(position, "hide");
    if (event.animationName === keyframes.name) {
      onHide?.();
    }
  };

  // 位置偏移：所以 top/bottom 作为 inline style、middle 走常量 css
  let positionStyle: SerializedStyles | undefined;
  let positionInline: React.CSSProperties | undefined;
  if (position === "top") {
    positionInline = { top: offsetTop / 100 + "rem" };
  } else if (position === "bottom") {
    positionInline = { bottom: offsetBottom / 100 + "rem" };
  } else {
    positionStyle = style.middle;
  }

  return (
    <div
      {...attributes}
      css={[style.container, positionStyle, animation, containerStyle]}
      style={positionInline}
      onAnimationEnd={animationEnd}
    >
      {showContent}
    </div>
  );
}
