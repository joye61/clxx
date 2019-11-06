import { css } from "@emotion/core";
import { vw } from "../cssUtil";
import { is } from "../is";
export const style = {
    customHeight(height) {
        let h = { mobile: vw(32), pc: `32px` };
        if (is.number(height)) {
            h = { mobile: vw(height), pc: `${height}px` };
        }
        else if (is.string(height)) {
            h = { mobile: height, pc: height };
        }
        return h;
    },
    container(height) {
        const h = this.customHeight(height);
        return css `
      overflow: hidden;
      height: ${h.mobile};
      @media screen and (min-width: 576px) {
        height: ${h.pc};
      }
    `;
    },
    ul: css `
    margin: 0;
    padding: 0;
    list-style-type: none;
    overflow: hidden;
    transform: translateY(0);
  `,
    li(height) {
        const h = this.customHeight(height);
        return css `
      position: relative;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      height: ${h.mobile};
      line-height: ${h.mobile};
      @media screen and (min-width: 576px) {
        height: ${h.pc};
        line-height: ${h.pc};
      }
    `;
    }
};
