import { css } from "@emotion/core";

export const style = {
  row: css({
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "flex-start"
  }),
  col: css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    flexShrink: 0
  })
};