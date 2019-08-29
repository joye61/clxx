import { css, keyframes } from "@emotion/core";
import { vw } from "../cssUtil";

export const showAnimation = keyframes`
  from {
    opacity: 0;
    transform: translate3d(-50%, 30%, 0);
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
    transform: translate3d(-50%, -30%, 0);
  }
`;

export const style = {
  container: css`
    position: fixed;
    max-width: ${vw(375 * 0.8)};
    left: 50%;
    transform: translate3d(-50%, 0, 0);
    z-index: 9999;
    @media screen and (min-width: 576px) {
      max-width: 400px;
    }
  `,
  containerShow: css`
    animation: ${showAnimation} 0.2s ease-in;
  `,
  containerHide: css`
    animation: ${hideAnimation} 0.2s ease-out;
  `,
  top: css`
    top: ${vw(30)};
    @media screen and (min-width: 576px) {
      top: 30px;
    }
  `,
  middle: css`
    top: 50%;
  `,
  bottom: css`
    bottom: ${vw(30)};
    @media screen and (min-width: 576px) {
      bottom: 30px;
    }
  `,
  content: (rounded: boolean) => {
    let radius = rounded ? `border-radius: ${vw(15)};` : null;
    return css`
      background-color: rgba(50, 50, 50, 0.9);
      color: #fff;
      margin: 0;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: ${vw(12)};
      line-height: ${vw(30)};
      padding: 0 ${vw(10)};
      border-radius: ${rounded ? vw(15) : 0};
      @media screen and (min-width: 576px) {
        font-size: 12px;
        line-height: 30px;
        padding: 0 10px;
        border-radius: ${rounded ? "15px" : 0};
      }
    `;
  }
};
