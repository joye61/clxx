/** @jsx jsx */
import { jsx } from "@emotion/core";
import { style } from "./extraStyle";

export function Extra() {
  return (
    <div css={style.container}>
      <div css={[style.item, style.item1]}></div>
      <div css={[style.item, style.item2]}></div>
      <div css={[style.item, style.item3]}></div>
    </div>
  );
}
