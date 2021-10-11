import { css, keyframes } from "@emotion/react";
import { ClxxScreenEnv, vw } from "../utils/cssUtil";

export const showAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50%) scale(0.6);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
`;

export const hideAnimation = keyframes`
  from {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(-50%) scale(0.6);
  }
`;

export const style = {
  container: css({
    position: "fixed",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 9999,
    [`@media (min-width: ${ClxxScreenEnv.CriticalWidth}px)`]: {
      maxWidth: `${ClxxScreenEnv.CriticalWidth * 0.8}px`,
    },
  }),
  containerShow: css({ animation: `${showAnimation} 200ms` }),
  containerHide: css({ animation: `${hideAnimation} 200ms` }),
  top(offset: number) {
    return css({
      top: vw(offset),
      [`@media (min-width: ${ClxxScreenEnv.CriticalWidth}px)`]: {
        top: vw(offset, true),
      },
    });
  },
  middle: css({ top: "50%" }),
  bottom(offset: number) {
    return css({
      bottom: vw(offset),
      [`@media (min-width: ${ClxxScreenEnv.CriticalWidth}px)`]: {
        bottom: vw(offset, true),
      },
    });
  },
  content: (rounded: boolean) => {
    return css({
      position: "relative",
      backgroundColor: "rgba(50, 50, 50, 0.75)",
      color: "#fff",
      margin: 0,
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
      fontSize: vw(26),
      lineHeight: vw(72),
      padding: `0 ${vw(30)}`,
      borderRadius: rounded ? vw(36) : 0,
      [`@media (min-width: ${ClxxScreenEnv.CriticalWidth}px)`]: {
        fontSize: vw(26, true),
        lineHeight: vw(72, true),
        padding: `0 ${vw(30, true)}`,
        borderRadius: rounded ? vw(36, true) : 0,
      },
    });
  },
  contentMiddle: css({
    transform: `translateY(-50%)`,
  }),
};
