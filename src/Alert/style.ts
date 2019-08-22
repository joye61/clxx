import { css, keyframes } from "@emotion/core";
import { vw } from "../cssUtil";

export const showAnimation = keyframes`
from {
  opacity: 0;
  transform: scale(0.9);
}
to {
  opacity: 1;
  transform: scale(1);
}
`;
export const hideAnimation = keyframes`
from {
  opacity: 1;
  transform: scale(1);
}
to {
  opacity: 0;
  transform: scale(0.9);
}
`;

export const style = {
  alert: css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  `,
  alertMask: css`
    background-color: rgba(0, 0, 0, 0.5);
  `,
  container: css`
    background-color: #fff;
    width: ${vw(280)};
    border-radius: ${vw(10)};
    overflow: hidden;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    @media screen and (min-width: 576px) {
      width: 320px;
      border-radius: 10px;
    }
  `,
  containerShow: css`
    animation: ${showAnimation} 100ms ease-in;
  `,
  containerHide: css`
    animation: ${hideAnimation} 100ms ease-out;
  `,

  content: css`
    font-size: ${vw(16)};
    margin: 0;
    padding: ${vw(20)};
    text-align: center;
    color: #333;
    line-height: 1.6;
    @media screen and (min-width: 576px) {
      font-size: 16px;
      padding: 30px;
    }
  `,
  btn: css`
    display: flex;
    border-top: 1px solid #f0f0f0;
    font-size: 0;
    div {
      cursor: pointer;
      flex: 1;
      background: transparent;
      font-size: ${vw(15)};
      line-height: ${vw(40)};
      text-align: center;
      box-sizing: border-box;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      font-weight: 500;
      @media screen and (min-width: 576px) {
        font-size: 15px;
        line-height: 50px;
      }
    }
  `,
  confirm: css`
    border: none;
    color: #007bff;
    &:active {
      color: #007bff - #333;
      background-color: #f5f5f5;
    }
  `,
  cancel: css`
    border: none;
    border-right: 1px solid #f0f0f0;
    color: #888;
    &:active {
      color: #555;
      background-color: #f5f5f5;
    }
  `
};
