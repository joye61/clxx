import { css, keyframes, Theme } from "@emotion/react";
import { adaptive } from "../utils/cssUtil";
import { Interpolation, Keyframes } from "@emotion/serialize";

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
export function getAnimation(position: "top" | "middle" | "bottom", type: "show" | "hide") {
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
      animation: `${keyframes} 300ms ease`,
    }),
  };
}

export const style: Record<
  string,
  Interpolation<Theme> | ((...params: any[]) => Interpolation<Theme>)
> = {
  container() {
    return css(
      {
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
      },
      adaptive({
        maxWidth: 600,
      })
    );
  },

  top(offset: number) {
    return adaptive({ top: offset });
  },
  middle: { top: "50%" },
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
        paddingTop: 40,
        paddingBottom: 40,
        borderRadius: radius ?? 0,
      })
    );
  },
  contentMiddle: {
    transform: `translateY(-50%)`,
  },
};
