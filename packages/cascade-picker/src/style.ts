import { css } from "@emotion/core";
import { vw } from "@clxx/base";

export const style = {
  item: css({
    flex: 1,
    flexBasis: 0,
    fontSize: vw(16),
    lineHeight: vw(30),
    overflow: "hidden",
    border: `1px solid transparent`,
    boxSizing: "border-box",
    userSelect: "none",
    span: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    },
    svg: {
      flexShrink: 0,
      marginLeft: vw(5),
      width: vw(20),
      path: {
        fill: "#999"
      }
    }
  }),
  itemPlaceholder: css({
    color: "#999",
    border: `1px solid #108ee9`,
    boxShadow: `0 0 3px 0 #108ee9`,
    padding: `0 ${vw(5)}`,
    borderRadius: vw(15)
  }),
  seperator: css({
    color: "#999",
    fontSize: vw(14),
    lineHeight: 1
  })
};
