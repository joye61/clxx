import React from "react";
import { style, barNum } from "./WaveStyle";

export interface WaveLoadingOption {
  color?: string;
}

/**
 * 波浪形Loading
 * @param {*} color 颜色
 */
export function WaveLoading({ color = "#000" }: WaveLoadingOption) {
  const list = [];
  for (let i = 0; i < barNum; i++) {
    list.push(<span key={i} css={[style.item(color), style[`bar-${i}`]]} />);
  }
  return <div css={style.container}>{list}</div>;
}
