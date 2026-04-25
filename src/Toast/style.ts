import { css, keyframes } from "@emotion/react";
import { Keyframes } from "@emotion/serialize";
import { fontStack } from "../utils/theme";

const easing = "cubic-bezier(.22,.61,.36,1)";

export const middleShowAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50%) scale(0.92);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
`;

export const middleHideAnimation = keyframes`
  from {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(-50%) scale(0.92);
  }
`;

export const topShowAnimation = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -120%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
`;
export const topHideAnimation = keyframes`
  from {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -120%);
  }
`;
export const bottomShowAnimation = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, 120%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
`;
export const bottomHideAnimation = keyframes`
  from {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  to {
    opacity: 0;
    transform: translate(-50%, 120%);
  }
`;

/**
 * 根据位置和类型获取动画
 */
export function getAnimation(
  position: "top" | "middle" | "bottom",
  type: "show" | "hide",
) {
  const animation = {
    top: [topShowAnimation, topHideAnimation],
    middle: [middleShowAnimation, middleHideAnimation],
    bottom: [bottomShowAnimation, bottomHideAnimation],
  };
  let keyframes: Keyframes;
  if (type === "show") {
    keyframes = animation[position][0];
  } else {
    keyframes = animation[position][1];
  }

  return {
    keyframes,
    animation: css({
      animation: `${keyframes} 260ms ${easing}`,
    }),
  };
}

export const style = {
  // 容器静态样式：位置偏移由 container 提供，具体 top/bottom 偏移走 inline style。
  container: css({
    position: "fixed",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 9999,
    maxWidth: "6rem",
    pointerEvents: "none",
    fontFamily: fontStack,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  }),

  middle: css({ top: "50%" }),

  // content 中与 radius 无关的部分作为常量，radius 走 inline style
  content: css({
    position: "relative",
    backgroundColor: "rgba(0,0,0,.78)",
    color: "#ffffff",
    margin: 0,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    lineHeight: 1.5,
    fontSize: ".28rem",
    fontWeight: 400,
    letterSpacing: ".01rem",
    textAlign: "center",
    padding: ".2rem .32rem",
    boxShadow: "0 .12rem .32rem rgba(0,0,0,.18)",
    backdropFilter: "blur(20px) saturate(160%)",
    WebkitBackdropFilter: "blur(20px) saturate(160%)",
  }),

  contentMiddle: css({
    transform: `translateY(-50%)`,
  }),
};
