import { vw } from "@clxx/base";
import { css } from "@emotion/core";

export const itemHeight = 46;

export const style = {
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
      letterSpacing: vw(1, true)
    },

    "&.cancel": {
      color: "#6c757d"
    },
    "&.confirm": {
      color: "#007bff"
    }
  }),
  result: css({
    position: "absolute",
    top: 0,
    height: "100%",
    left: "50%",
    transform: "translateX(-50%)"
  })
};
