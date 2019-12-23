import { css } from "@emotion/core";
import { vw } from "@clxx/base";
import { itemHeight } from "./ScrollContentStyle";

export const style = {
  container: css({
    userSelect: "none",
    backgroundColor: "#fff",
    width: "100%",
    overflow: "hidden",
    boxShadow: `0 -1px 5px 0px #00000022`,
    borderTopLeftRadius: vw(10),
    borderTopRightRadius: vw(10),
    "@media (min-width: 576px)": {
      borderTopLeftRadius: vw(10, true),
      borderTopRightRadius: vw(10, true)
    }
  }),
  btnGroup: css({
    position: "relative",
    backgroundColor: "#f5f6f7",
    WebkitTapHighlightColor: "transparent",
    "&::after": {
      display: "block",
      content: '""',
      position: "absolute",
      left: 0,
      bottom: 0,
      width: "100%",
      height: "1px",
      backgroundColor: "#6c757d82",
      transform: `scaleY(${1 / window.devicePixelRatio})`
    }
  }),
  btn: css({
    fontSize: vw(16),
    lineHeight: vw(itemHeight),
    padding: `0 ${vw(12)}`,
    letterSpacing: vw(1),
    transition: "transform 100ms, opacity 100ms",
    "&:active": {
      transform: "scale(1.1)",
      opacity: 0.6
    },
    "@media (min-width: 576px)": {
      fontSize: vw(16, true),
      lineHeight: vw(itemHeight, true),
      padding: `0 ${vw(12, true)}`,
      letterSpacing: vw(1, true),
    },

    "&.cancel": {
      color: "#6c757d"
    },
    "&.confirm": {
      color: "#007bff"
    }
  }),
  currentValue: css({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#000",
    fontSize: vw(18),
  }),
  item: css({
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    padding: 0,
    color: "#000",
    fontSize: vw(18)
  })
};
