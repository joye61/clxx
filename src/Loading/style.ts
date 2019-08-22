import { css } from "@emotion/core";
import { vw } from "../cssUtil";

export const style = {
  mask: css`
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
  container: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.8);
    width: ${vw(90)};
    height: ${vw(90)};
    border-radius: ${vw(10)};
    @media screen and (min-width: 576px) {
      width: 90px;
      height: 90px;
      border-radius: 10px;
    }
  `,
  hint(hintColor: string) {
    return css`
      color: ${hintColor};
      padding: 0;
      margin: 0;
      font-size: ${vw(12)};
      margin-top: ${vw(10)};
      @media screen and (min-width: 576px) {
        font-size: 12px;
        margin-top: 10px;
      }
    `;
  }
};
