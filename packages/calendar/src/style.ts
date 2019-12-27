import { css } from "@emotion/core";
import { vw } from "@clxx/base";

export const style = {
  row: css({
    display: "flex",
    alignItems: "stretch",
    position: "relative"
  }),
  item: css({
    flexBasis: `${100 / 7}%`,
    flexGrow: 1,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none"
  }),

  defaultCommon: css({
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  }),

  defaultItem: css({
    fontFamily: "Arial",
    fontSize: vw(18),
    color: "#333",
    "@media (min-width: 576px)": {
      fontSize: vw(18, true)
    }
  }),
  defaultItemGray: css({
    color: `rgb(187, 187, 187)`
  }),
  defaultItemMonth: css({
    fontWeight: 600
  }),

  defaultSelected: css({
    backgroundColor: "#f5f5f5",
    color: "#108ee9"
  }),

  defaultToday: css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    span: {
      fontWeight: "normal"
    },
    "span:nth-of-type(1)": {
      backgroundColor: "#108ee9",
      color: "#fff",
      textAlign: "center",
      borderRadius: "50%",
      fontSize: vw(16),
      width: vw(30),
      height: vw(30),
      lineHeight: vw(30),
      "@media (min-width: 576px)": {
        fontSize: vw(16, true),
        width: vw(30, true),
        height: vw(30, true),
        lineHeight: vw(30, true)
      }
    },
    "span:nth-of-type(2)": {
      fontSize: vw(10),
      color: "#108ee9"
    }
  }),

  defaultTitleItem: css({
    fontSize: vw(16),
    backgroundColor: "#f5f5f5",
    "@media (min-width: 576px)": {
      fontSize: vw(16, true)
    }
  })
};
