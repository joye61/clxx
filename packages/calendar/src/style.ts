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
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    outline: "none"
  }),

  // 默认元素的通用样式
  defaultItemCommon: css({
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  }),

  // 默认标题元素的样式
  defaultTitleItem: css({
    fontSize: vw(16),
    // backgroundColor: "#f5f5f5",
    "@media (min-width: 576px)": {
      fontSize: vw(16, true)
    }
  }),

  // 默认元素的样式
  defaultItem: css({
    fontFamily: "Arial",
    fontSize: vw(18),
    color: "#333",
    "@media (min-width: 576px)": {
      fontSize: vw(18, true)
    }
  }),
  // 非当月的元素样式
  defaultItemOutOfMonth: css({
    color: `rgb(187, 187, 187)`
  }),
  // 当月的元素样式
  defaultItemMonth: css({
    fontWeight: 600
  }),

  defaultSelected: css({
    borderRadius: "50%",
    backgroundColor: "#f5f5f5",
    color: "#108ee9"
  }),

  defaultToday: css({
    borderRadius: "50%",
    color: "#f70e0e",
    span: {
      position: "absolute",
      left: "50%",
      transform: `translateX(-50%)`,
      fontWeight: "normal",
      color: "#f70e0e",
      fontSize: vw(9),
      bottom: vw(6),
      "@media (min-width: 576px)": {
        fontSize: vw(9, true),
        bottom: vw(8, true)
      }
    }
  })
};
