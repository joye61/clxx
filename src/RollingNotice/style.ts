import { css } from "@emotion/core";
import { vw } from "../cssUtil";

export const style = {
  container: css`
    overflow: hidden;
    height: ${vw(32)};
  `,
  ul: css`
    margin: 0;
    padding: 0;
    list-style-type: none;
    overflow: hidden;
  `,
  li: css`
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: ${vw(14)};
    height: ${vw(32)};
    line-height: ${vw(32)};
  `
};
