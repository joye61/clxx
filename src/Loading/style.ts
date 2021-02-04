import { css, keyframes } from "@emotion/react";
import { ClxxScreenEnv, vw } from "../utils/cssUtil";

export const LoadingShow = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
export const LoadingHide = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

export const style = {
  boxCommon: css({
    borderRadius: vw(16),
    backgroundColor: `rgba(0, 0, 0, .8)`,
    [`@media (min-width: ${ClxxScreenEnv.CriticalWidth}px)`]: {
      borderRadius: vw(16, true),
    },
  }),
  box: css({
    width: vw(160),
    height: vw(160),
    "> div:first-of-type": {
      width: vw(60),
      height: vw(60),
    },
    [`@media (min-width: ${ClxxScreenEnv.CriticalWidth}px)`]: {
      height: vw(160, true),
      width: vw(160, true),
      "> div:first-of-type": {
        width: vw(60, true),
        height: vw(60, true),
      },
    },
  }),

  boxWithExtra: css({
    padding: vw(30),
    "> div:first-of-type": {
      width: vw(48),
      height: vw(48),
    },
    [`@media (min-width: ${ClxxScreenEnv.CriticalWidth}px)`]: {
      padding: vw(30, true),
      "> div:first-of-type": {
        width: vw(48, true),
        height: vw(48, true),
      },
    },
  }),

  // 显示动画
  boxShow(duration: number) {
    return css({
      animation: `${LoadingShow} ${duration}ms`,
    });
  },

  // 隐藏动画
  boxHide(duration: number) {
    return css({
      animation: `${LoadingHide} ${duration}ms`,
    });
  },

  // 默认的额外信息样式
  defaultExtra: css({
    color: "#f5f5f5",
    fontSize: vw(24),
    marginLeft: vw(20),
    whiteSpace: "nowrap",
    [`@media (min-width: ${ClxxScreenEnv.CriticalWidth}px)`]: {
      fontSize: vw(28, true),
      marginLeft: vw(20, true),
    },
  }),
};
