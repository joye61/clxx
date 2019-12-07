/** @jsx jsx */
import { jsx } from "@emotion/core";
import Swiper from "swiper";
import { RowCenter } from "../Layout/Row";
import { style } from "./style";
import { prefix0 } from "./util";
import ReactDOM from "react-dom";
import React from "react";

/**
 * 更新列表
 */
export interface UpdateListOption {
  swiper: Swiper;
  start: number;
  end: number;
  showIndex: number;
  type: "y" | "m" | "d" | "h" | "i" | "s";
}

export function updateList(option: UpdateListOption) {
  const unitMap = {
    y: "年",
    m: "月",
    d: "日",
    h: "时",
    i: "分",
    s: "秒"
  };

  const list: React.ReactNode[] = [];
  for (let i = option.start; i <= option.end; i++) {
    list.push(
      <div className="swiper-slide">
        <RowCenter css={style.item} key={i}>
          {prefix0(i)}
          <span css={style.unit}>{unitMap[option.type]}</span>
        </RowCenter>
      </div>
    );
  }

  return new Promise(resolve => {
    ReactDOM.render(
      <React.Fragment>{list}</React.Fragment>,
      option.swiper.wrapperEl,
      () => {
        option.swiper.update();
        option.swiper.slideTo(option.showIndex);
        resolve();
      }
    );
  });
}
