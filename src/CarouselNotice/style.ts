import { css, keyframes } from "@emotion/core";
import { vw } from "../utils/cssUtil";
import { getEnv } from "../utils/global";

export const Bubble = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-50%);
  }
`;

export const getStyle = () => {
  const env = getEnv();
  return {
    box: css({
      position: "relative",
      overflow: "hidden",
      transition: "all 200ms",
      height: vw(40),
      [`@media (min-width: ${env.criticalWidth}px)`]: {
        height: vw(40, true),
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
};
