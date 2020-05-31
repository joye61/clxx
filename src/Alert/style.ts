import { css } from "@emotion/core";
import { getEnv } from "../utils/global";
import { vw } from "../utils/cssUtil";

export const getStyle = () => {
  const env = getEnv();

  return {
    container: css({
      backgroundColor: "#fff",
      width: vw(env.designWidth * 0.8),
      borderRadius: vw(8),
      overflow: "hidden",
      color: "#333",
      boxShadow: `0 0 4px 0 #00000050;`,
      [`@media (min-width: ${env.criticalWidth}px)`]: {
        width: vw(env.designWidth * 0.8, true),
        borderRadius: vw(8, true),
      },
    }),
    title: css({
      textAlign: "center",
      fontSize: vw(18),
      padding: `${vw(20)} ${vw(20)} 0`,
      margin: 0,
      fontWeight: 500,
      lineHeight: 1,
      [`@media (min-width: ${env.criticalWidth}px)`]: {
        fontSize: vw(18, true),
        padding: `${vw(20, true)} ${vw(20, true)} 0`,
      },
    }),
    content: css({
      padding: vw(20),
      fontSize: vw(16),
      lineHeight: 1.6,
      textAlign: "center",
      [`@media (min-width: ${env.criticalWidth}px)`]: {
        padding: vw(20, true),
        fontSize: vw(16, true),
      },
    }),
    btn: css({
      position: "relative",
			height: vw(50),
			userSelect: 'none',
      [`@media (min-width: ${env.criticalWidth}px)`]: {
        height: vw(50, true),
      },
      "> div": {
        position: "relative",
        flex: 1,
        textAlign: "center",
      },
      "&::before": {
        position: "absolute",
        top: "-1px",
        left: 0,
        content: `""`,
        display: "block",
        borderTop: "1px solid #e0e0e0",
        width: "100%",
        height: "1px",
        transform: `scaleY(${1 / window.devicePixelRatio})`,
      },
    }),

    defaultBtn: css({
      fontSize: vw(16),
      [`@media (min-width: ${env.criticalWidth}px)`]: {
        fontSize: vw(16, true),
      },
      height: "100%",
    }),

    defaultBtncancel: css({
      color: "#999",
      "&:active": {
        color: "#666",
        backgroundColor: "#f5f5f5",
      },
    }),
    defaultBtnconfirm: css({
      color: "#007bff",
      "&:active": {
        color: "#006ee4",
        backgroundColor: "#f5f5f5",
      },
    }),

    btnCancel: css({
      zIndex: 1,
      "&::after": {
        position: "absolute",
        top: 0,
        content: `""`,
        height: "100%",
        width: "1px",
        right: "-1px",
        borderRight: "1px solid #e0e0e0",
        transform: `scaleX(${1 / window.devicePixelRatio})`,
      },
    }),
  };
};
