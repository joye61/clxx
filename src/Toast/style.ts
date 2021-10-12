import { css, keyframes } from "@emotion/react";
import { getContextValue } from "../context";
import { ContextValue } from "../context";
import { adaptive } from "../utils/cssUtil";
import { Keyframes } from "@emotion/serialize";

export const middleShowAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50%) scale(0.9);
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
    transform: translateX(-50%) scale(0.9);
  }
`;

export const topShowAnimation = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -100%);
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
    transform: translate(-50%, -100%);
  }
`;
export const bottomShowAnimation = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, 100%);
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
    transform: translate(-50%, 100%);
  }
`;

/**
 * 根据位置和类型获取动画
 * @param position 
 * @param type 
 * @returns 
 */
export function getAnimation(
  position: "top" | "middle" | "bottom",
  type: "show" | "hide"
) {
  const showAnimation = {
    top: topShowAnimation,
    middle: middleShowAnimation,
    bottom: bottomShowAnimation,
  };
  const hideAnimation = {
    top: topHideAnimation,
    middle: middleHideAnimation,
    bottom: bottomHideAnimation,
  };
  let keyframes: Keyframes;
  if (type === "show") {
    keyframes = showAnimation[position];
  } else {
    keyframes = hideAnimation[position];
  }

  return {
    keyframes,
    animation: css({
      animation: `${keyframes} 200ms ease`,
    }),
  };
}

export const style = {
  container() {
    const ctx = getContextValue() as ContextValue;
    return css({
      position: "fixed",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 9999,
      maxWidth: "80vw",
      [`@media (min-width: ${ctx.maxScreenWidth}px)`]: {
        maxWidth: `${ctx.maxScreenWidth * 0.8}px`,
      },
      [`@media (max-width: ${ctx.minScreenWidth}px)`]: {
        maxWidth: `${ctx.minScreenWidth * 0.8}px`,
      },
    });
  },

  top(offset: number) {
    return adaptive({ top: offset });
  },
  middle: css({ top: "50%" }),
  bottom(offset: number) {
    return adaptive({ bottom: offset });
  },
  content: (radius?: number) => {
    return css(
      {
        position: "relative",
        backgroundColor: "rgba(0, 0, 0, .7)",
        color: "#fff",
        margin: 0,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        lineHeight: 1,
      },
      adaptive({
        fontSize: 26,
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 30,
        paddingBottom: 30,
        borderRadius: radius ?? 0,
      })
    );
  },
  contentMiddle: css({
    transform: `translateY(-50%)`,
  }),
};
