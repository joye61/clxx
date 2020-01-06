import { css } from "@emotion/core";

export const style = {
  container: css({
    overflow: "hidden",
    position: "relative",
    touchAction: "none"
  }),
  content: css({
    position: "absolute",
    left: 0,
    top: 0
  })
};
