import { css } from "@emotion/core";
import { vw } from "@clxx/base";

export const style = {
  container: css({
    backgroundColor: "#fff",
    userSelect: "none",
    borderTopLeftRadius: vw(10),
    borderTopRightRadius: vw(10),
    overflow: "hidden",
    boxShadow: `0 0 5px 0px #00000094`,
    "@media (min-width: 576px)": {
      borderTopLeftRadius: vw(10, true),
      borderTopRightRadius: vw(10, true)
    }
  }),

  defaultTitle: css({
    height: "100%",
    p: {
      color: "#333",
      margin: 0,
      fontSize: vw(16),
      "@media (min-width: 576px)": {
        fontSize: vw(16, true)
      }
    }
  }),

  // 列表区域
  optionItem: css({
    fontSize: vw(16),
    lineHeight: 1.2,
    textAlign: "center",
    whiteSpace: "pre-wrap",
    "@media (min-width: 576px)": {
      fontSize: vw(16, true)
    }
  }),
  content: css({
    ">div": {
      flex: 1
    }
  })
};
