import { css } from "@emotion/core";
import { vw } from "../cssUtil";
import { css as keyframes } from "emotion";

export const fadeOut = keyframes`
  from {
    transform: translate(-50%, -50%) scale(.4);
    opacity: .4;
  }
  20% {
    transform: translate(-50%, -150%) scale(1.2);
    opacity: 1;
  }
  80% {
    transform: translate(-50%, -150%) scale(1.2);
    opacity: 1;
  }  
  to {
    transform: translate(-50%, -180%) scale(1.2);
    opacity: 0;
  }
`;

export const style = {
  container: css({
    position: "relative"
  }),
  effectContainer: css({
    position: "absolute",
    zIndex: 9,
    left: "50%",
    top: "50%",
    animation: `${fadeOut} 1000ms ease`,
    fontSize: 0
  }),
  defaultSVGContainer: css({
    width: vw(30),
    "@media (min-width: 576px)": {
      width: vw(30, true)
    },
    path: {
      fill: "red"
    }
  })
};
