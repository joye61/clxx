import { vw } from "@clxx/base";
import { css } from "@emotion/core";
/**
 * 滚动列表的每一项高度
 */
export const itemHeight = 46;

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
    "@media (min-width: 576px)": {
      fontSize: vw(16, true),
      lineHeight: vw(itemHeight, true),
      padding: `0 ${(vw(12), true)}`,
      letterSpacing: vw(1, true)
    },
    "&.cancel": {
      color: "#6c757d"
    },
    "&.confirm": {
      color: "#007bff"
    }
  }),
  item: css({
    color: "#000",
    margin: 0,
    fontFamily: "Tahoma, Arial, Verdana, Tahoma",
    userSelect: "none",
    fontSize: vw(20),
    "@media (min-width: 576px)": {
      fontSize: vw(20, true)
    }
  }),
  unit: css({
    position: "relative",
    color: "#999",
    // top: vw(2),
    fontSize: vw(12),
    marginLeft: vw(2),
    "@media (min-width: 576px)": {
      top: vw(2, true),
      fontSize: vw(12, true),
      marginLeft: vw(2, true)
    }
  }),

  colGroup: css({
    "> div": {
      flexBasis: 0,
      flexGrow: 1,
      flexShrink: 0,
      "&.clxx-dtp-year": {
        flexGrow: 1.3
      }
    }
  }),

  resultBox: css({
    height: "100%"
  }),
  hint: css({
    color: "gray",
    fontSize: vw(12),
    "@media (min-width: 576px)": {
      fontSize: vw(12, true),
    }
  }),
  result: css({
    color: "#000",
    whiteSpace: "nowrap",
    fontSize: vw(16),
    "@media (min-width: 576px)": {
      fontSize: vw(16, true),
    }
  })
};
