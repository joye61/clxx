/** @jsx jsx */
import { jsx } from "@emotion/core";
import { style, barNum } from "./WaveStyle";

/**
 * 波浪形Loading
 * @param {*} color 颜色
 */
export function WaveLoading() {
  const list = [];
  for (let i = 0; i < barNum; i++) {
    list.push(<span key={i} css={[style.item, style[`bar-${i}`]]} />);
  }
  return (
    <div css={style.container} className="cl-WaveLoading">
      {list}
    </div>
  );
}
