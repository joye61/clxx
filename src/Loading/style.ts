import { css, keyframes } from "@emotion/react";
import { getEnv } from "../utils/global";
import { vw } from "../utils/cssUtil";

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

export const getStyle = () => {
  const env = getEnv();

  return {
    boxCommon: css({
      borderRadius: vw(8),
      backgroundColor: `rgba(0, 0, 0, .8)`,
      [`@media (min-width: ${env.criticalWidth}px)`]: {
        borderRadius: vw(8, true),
      },
    }),
    box: css({
      width: vw(80),
      height: vw(80),
      "> div:first-of-type": {
        width: vw(30),
        height: vw(30),
      },
      [`@media (min-width: ${env.criticalWidth}px)`]: {
        height: vw(80, true),
        width: vw(80, true),
        "> div:first-of-type": {
          width: vw(30, true),
          height: vw(30, true),
        },
      },
    }),

    boxWithExtra: css({
      padding: vw(15),
      "> div:first-of-type": {
        width: vw(24),
        height: vw(24),
      },
      [`@media (min-width: ${env.criticalWidth}px)`]: {
        padding: vw(15, true),
        "> div:first-of-type": {
          width: vw(24, true),
          height: vw(24, true),
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
      fontSize: vw(14),
      marginLeft: vw(10),
      whiteSpace: "nowrap",
      [`@media (min-width: ${env.criticalWidth}px)`]: {
        fontSize: vw(14, true),
        marginLeft: vw(10, true),
      },
    }),
  };
};
