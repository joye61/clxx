import { css, keyframes } from "@emotion/react";
import { Keyframes } from "@emotion/serialize";

const fontStack =
  '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
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
  container() {
    return css({
      position: "fixed",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 9999,
      maxWidth: "6rem",
      pointerEvents: "none",
      fontFamily: fontStack,
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    });
  },

  top(offset: number) {
    return css({ top: offset / 100 + "rem" });
  },
  middle: css({ top: "50%" }),
  bottom(offset: number) {
    return css({ bottom: offset / 100 + "rem" });
  },
  content: (radius?: number) => {
    return css({
      position: "relative",
      backgroundColor: "rgba(17,24,39,.88)",
      color: "#ffffff",
      margin: 0,
      // 允许多行，超过 maxWidth 时自然换行
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      lineHeight: 1.5,
      fontSize: ".28rem",
      fontWeight: 400,
      letterSpacing: ".01rem",
      textAlign: "center",
      padding: ".2rem .32rem",
      borderRadius: radius ? radius / 100 + "rem" : 0,
      boxShadow: "0 .12rem .32rem rgba(0,0,0,.25)",
    });
  },
  contentMiddle: {
    transform: `translateY(-50%)`,
  },
};
