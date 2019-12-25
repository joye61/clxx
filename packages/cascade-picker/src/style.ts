import { css } from "@emotion/core";
import { vw } from "@clxx/base";

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
  colGroup: css({
    "&>div": {
      width: "100%"
    }
  })
};
