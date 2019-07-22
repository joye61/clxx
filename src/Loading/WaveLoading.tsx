import React from "react";

export interface WaveLoadingOption {
  color: string;
}

/**
 * 波浪形Loading
 * @param {*} color 颜色
 */
export function WaveLoading({ color = "#000" }: WaveLoadingOption) {
  const list = [];
  for (let i = 0; i < 6; i++) {
    list.push(
      <span
        className="cl-Loading-wave-item"
        key={i}
        style={{ backgroundColor: color }}
      />
    );
  }
  return <div className="cl-Loading-wave-container">{list}</div>;
}
