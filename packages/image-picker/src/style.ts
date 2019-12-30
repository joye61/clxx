import { css } from "@emotion/core";
import { vw } from "@clxx/base";

export const style = {
  pick: css({
    width: "100%",
    height: "100%",
    boxShadow: `0 0 1px black`,
    backgroundColor: `#f5f5f5`,
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    svg: {
      width: "40%",
      path: {
        fill: "gray"
      }
    },
    span: css({
      color: "gray",
      fontSize: vw(12),
      "@media (min-width: 576px)": {
        fontSize: vw(12, true)
      }
    }),
    "input[type=file]": {
      display: "none"
    },
    "&:active": {
      opacity: 0.5
    }
  })
};
