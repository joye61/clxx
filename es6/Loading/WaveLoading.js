/** @jsx jsx */
import { jsx } from "@emotion/core";
import { style, barNum } from "./WaveStyle";
/**
 * 波浪形Loading
 * @param {*} color 颜色
 */
export function WaveLoading({ color = "#000" }) {
    const list = [];
    for (let i = 0; i < barNum; i++) {
        list.push(jsx("span", { key: i, css: [style.item(color), style[`bar-${i}`]] }));
    }
    return jsx("div", { css: style.container }, list);
}
