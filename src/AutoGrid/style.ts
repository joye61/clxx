import { css } from "@emotion/react";

export const style = {
  itemBoxStyle: css({
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
    position: "relative",
    overflow: "hidden",
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
    }
  }),
  itemInnerStyle: css({
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  })
};
