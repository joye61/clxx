import { css } from "@emotion/react";

export const style = {
  row: css({
    display: "flex",
    width: "100%",
  }),
  itemBox: css({
    position: "relative",
    minWidth: 0,
  }),
  itemBoxSquare: css({
    "&:after,&::after": {
      content: "''",
      display: "block",
      height: 0,
      // 这个属性是设置块为方形的关键
      paddingBottom: "100%",
    },
  }),
  itemInner: css({
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  }),
};
