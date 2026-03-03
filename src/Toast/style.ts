import { css, keyframes } from "@emotion/react";
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

export const style = {
  container() {
    return css({
      position: "fixed",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 9999,
      maxWidth: '6rem',
    });
  },

  top(offset: number) {
    return css({ top: offset / 100 + 'rem' });
  },
  middle: css({ top: "50%" }),
  bottom(offset: number) {
    return css({ bottom: offset / 100 + 'rem' });
  },
  content: (radius?: number) => {
    return css({
      position: "relative",
      backgroundColor: "rgba(0, 0, 0, .8)",
      color: "#fff",
      margin: 0,
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
      lineHeight: 1,
      fontSize: '.26rem',
      paddingLeft: '.3rem',
      paddingRight: '.3rem',
      paddingTop: '.4rem',
      paddingBottom: '.4rem',
      borderRadius: radius ? radius / 100 + 'rem' : 0,
    });
  },
  contentMiddle: {
    transform: `translateY(-50%)`,
  },
};
