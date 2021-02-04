import { css } from "@emotion/react";

export const style = {
  btn: css({
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    input: css({
      display: "none",
    }),
  }),
  defaultBtn: css({
    backgroundColor: "#e0e0e0",
    border: `1px dashed #bbb`,
    svg: {
      width: "45%",
      path: {
        fill: "#888",
      },
    }
  }),
  defaultBtnDisable: css({
    backgroundColor: "#f5f5f5",
    border: `1px dashed #e5e5e5`,
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
