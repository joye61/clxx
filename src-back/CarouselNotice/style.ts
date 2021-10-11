import { css, keyframes } from "@emotion/react";
import { ClxxScreenEnv, vw } from "../utils/cssUtil";

export const Bubble = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-50%);
  }
`;

export const style = {
  box: css({
    position: "relative",
    overflow: "hidden",
    transition: "all 200ms",
    height: vw(80),
    [`@media (min-width: ${ClxxScreenEnv.CriticalWidth}px)`]: {
      height: vw(80, true),
    },
  }),
  wrapper: css({
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "200%",
  }),
  item: css({
    width: "100%",
    height: "50%",
    display: "flex",
    alignItems: "center",
    fontSize: "initial",
  }),
};
