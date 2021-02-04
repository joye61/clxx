import { css } from "@emotion/react";
import { ClxxScreenEnv, vw } from "../utils/cssUtil";

export const style = {
  container: css({
    backgroundColor: "#fff",
    width: vw(ClxxScreenEnv.DesignWidth * 0.8),
    borderRadius: vw(15),
    overflow: "hidden",
    color: "#333",
    boxShadow: `0 0 ${vw(8)} 0 #00000050`,
    [`@media (min-width: ${ClxxScreenEnv.CriticalWidth}px)`]: {
      width: vw(ClxxScreenEnv.DesignWidth * 0.8, true),
      borderRadius: vw(15, true),
      boxShadow: `0 0 ${vw(8, true)} 0 #00000050`,
    },
  }),
  title: css({
    textAlign: "center",
    fontSize: vw(30),
    padding: `${vw(30)} ${vw(30)} 0`,
    margin: 0,
    fontWeight: 600,
    lineHeight: 1,
    [`@media (min-width: ${ClxxScreenEnv.CriticalWidth}px)`]: {
      fontSize: vw(30, true),
      padding: `${vw(30, true)} ${vw(30, true)} 0`,
    },
  }),
  content: css({
    padding: vw(40),
    fontSize: vw(28),
    lineHeight: 1.6,
    textAlign: "center",
    [`@media (min-width: ${ClxxScreenEnv.CriticalWidth}px)`]: {
      padding: vw(40, true),
      fontSize: vw(28, true),
    },
  }),
  btn: css({
    position: "relative",
    height: vw(88),
    userSelect: "none",
    [`@media (min-width: ${ClxxScreenEnv.CriticalWidth}px)`]: {
      height: vw(88, true),
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
      borderTop: "1px solid #d0d0d0",
      width: "100%",
      height: "1px",
      transform: `scaleY(${1 / window.devicePixelRatio})`,
    },
  }),

  defaultBtn: css({
    fontSize: vw(30),
    [`@media (min-width: ${ClxxScreenEnv.CriticalWidth}px)`]: {
      fontSize: vw(30, true),
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
      borderRight: "1px solid #d0d0d0",
      transform: `scaleX(${1 / window.devicePixelRatio})`,
    },
  }),
};
