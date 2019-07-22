import React from "react";

export interface HelixLoadingOption {
  color: string;
}

/**
 * 菊花齿轮形Loading
 * @param {*} color 颜色
 */
export function HelixLoading({ color = "#fff" }: HelixLoadingOption) {
  const list = [];
  for (let i = 0; i < 12; i++) {
    list.push(
      <div className="cl-Loading-helix-item" key={i}>
        <span
          className="cl-Loading-helix-itembar"
          style={{ backgroundColor: color }}
        />
      </div>
    );
  }
  return <div className="cl-Loading-helix-container">{list}</div>;
}
