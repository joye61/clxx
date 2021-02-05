import { css } from "@emotion/react";

export const style = {
  itemBoxStyle: css({
    float: "left",
    position: "relative",
    "&:last-child": {
      marginRight: 0,
    },
  }),
  itemBoxSquare: css({
    "&:after,&::after": {
      content: "''",
      display: "block",
      height: 0,
      paddingBottom: "100%",
    },
  }),
  itemNull: css({
    visibility: "hidden",
  }),
  itemInnerStyle: css({
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  }),

  // 行样式
  rowStyle: css({
    width: "100%",
    "&:after,&::after": {
      content: "''",
      display: "table",
      height: 0,
      clear: "both"
    }
  })
};
