import { css } from "@emotion/react";
import { ClxxScreenEnv, vw } from "../utils/cssUtil";

export const style = {
  btn: css({
    position: "relative",
    "> input": css({
      position: "absolute",
      height: 0,
      display: "none",
    }),
  }),

  btnGridItem: css({
    width: "100%",
    height: "100%",
  }),
  btnSingle: css({
    width: vw(150),
    height: vw(150),
    [`@media (min-width: ${ClxxScreenEnv.CriticalWidth}px)`]: {
      width: vw(150, true),
      height: vw(150, true),
    },
  }),

  defaultBtnCenter: css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
  defaultBtn: css({
    backgroundColor: "#f5f5f5",
    boxShadow: `0 0 ${vw(2.5)} 0 #00000099`,
    [`@media (min-width: ${ClxxScreenEnv.CriticalWidth}px)`]: {
      boxShadow: `0 0 ${vw(2.5, true)} 0 #00000099`,
    },
    svg: {
      width: "45%",
      path: {
        fill: "#888",
      },
    },
  }),
  defaultBtnDisable: css({
    backgroundColor: "#f5f5f5",
    svg: {
      width: "50%",
      path: {
        fill: "#e5e5e5",
      },
    },
  }),

  preview: css({
    width: "100%",
    height: "100%",
    fontSize: 0,
    position: "relative",
    img: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  }),
  deleteBtn: css({
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,.6)",
    "> div": {
      width: "25%",
      height: "25%",
      svg: {
        width: "100%",
        height: "100%",
        path: {
          fill: "#fff",
        },
      },
    },
  }),
};
