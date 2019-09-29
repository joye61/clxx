/** @jsx jsx */
import { jsx } from "@emotion/core";
import { style } from "./style";

export function ImagePreview() {
  return (
    <div css={style.container}>
      <div css={style.imageBox}>
        <img src="" alt="" />
      </div>
    </div>
  );
}
