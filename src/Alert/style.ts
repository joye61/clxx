import { css, keyframes } from "@emotion/core";
import { vw } from "../cssUtil";

export const showAnimation = keyframes`
from {
  opacity: 0;
  transform: scale(0.8);
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
  transform: scale(0.8);
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
    font-size: 0;
    position: relative;
    &::before {
      position: absolute;
      top: -1px;
      left: 0;
      content: "";
      display: block;
      border-top: 1px solid #e0e0e0;
      width: 100%;
      height: 1px;
      transform: scaleY(${1 / window.devicePixelRatio});
    }
    div {
      cursor: pointer;
      flex: 1;
      background: transparent;
      font-size: ${vw(16)};
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
      color: #006bde;
      background-color: #f5f5f5;
    }
  `,
  cancel: css`
    border: none;
    color: #888;
    position: relative;
    &::after {
      position: absolute;
      content: "";
      height: 100%;
      width: 1px;
      right: -1px;
      border-right: 1px solid #e0e0e0;
      transform: scaleX(${1 / window.devicePixelRatio});
    }
    &:active {
      color: #555;
      background-color: #f5f5f5;
    }
  `
};
