import { css, keyframes } from "@emotion/core";
import { vw } from "../cssUtil";

export const showAnimation = keyframes`
  from {
    opacity: 0;
    transform: translate3d(-50%, ${vw(10)}, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(-50%, 0, 0);
  }
`;

export const hideAnimation = keyframes`
  from {
    opacity: 1;
    transform: translate3d(-50%, 0, 0);
  }
  to {
    opacity: 0;
    transform: translate3d(-50%, ${vw(-10)}, 0);
  }
`;

export const style = {
  container: css`
    position: fixed;
    max-width: ${vw(375 * 0.8)};
    left: 50%;
    transform: translate3d(-50%, 0, 0);
    z-index: 9999;
  `,
  containerShow: css`
    animation: ${showAnimation} 0.2s ease-in;
  `,
  containerHide: css`
    animation: ${hideAnimation} 0.2s ease-out;
  `,
  top: css`
    top: ${vw(30)};
  `,
  middle: css`
    top: 50%;
    transform: translate3d(-50%, -50%, 0) scale(1);
  `,
  bottom: css`
    bottom: ${vw(30)};
  `,
  content: css`
    background-color: rgba(50, 50, 50, 0.9);
    font-size: ${vw(12)};
    color: #fff;
    margin: 0;
    line-height: ${vw(30)};
    padding: 0 ${vw(10)};
  `
};
