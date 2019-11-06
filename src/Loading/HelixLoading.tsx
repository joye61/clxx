/** @jsx jsx */
import { jsx } from "@emotion/core";
import { style, barNum } from "./HelixStyle";

/**
 * 菊花齿轮形Loading
 * @param {*} color 颜色
 */
export function HelixLoading() {
  const list = [];
  for (let i = 0; i < barNum; i++) {
    list.push(<span css={style[`bar-${i}`]} key={i} />);
  }
  return <div css={style.container}>{list}</div>;
}
