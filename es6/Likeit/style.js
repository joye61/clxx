import { css } from "@emotion/core";
import { vw } from "../cssUtil";
import { css as rawCss, keyframes } from "emotion";
export const fadeOut = keyframes `
  from {
    transform: translate(-50%, -50%) scale(.4);
    opacity: 1;
  }
  to {
    transform: translate(-50%, -160%) scale(1.2);
    opacity: 0;
  }
`;
export const style = {
    fadeOutEffect: rawCss `
    position: absolute;
    z-index: 9;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(.5);
    animation: ${fadeOut} 800ms cubic-bezier(0.215, 0.61, 0.355, 1);
  `,
    defaultSVGContainer: css `
    font-size: 0;
    svg {
      path {
        fill: red;
      }
      width: ${vw(30)};
      @media screen and (min-width: 576px) {
        width: 30px;
      }
    }
  `
};
