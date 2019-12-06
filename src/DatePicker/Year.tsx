/** @jsx jsx */
import { jsx } from "@emotion/core";

import { DateItemProps } from "./types";
import { useState, useEffect } from "react";
import { Extra } from "./Extra";
import { ScrollSnap } from "../ReactSwiper/ScrollSnap";
import { style } from "./style";
import Swiper, { SwiperOptions } from "swiper";
import dayjs from "dayjs";
import { RowCenter } from "../Layout/Row";

export function Year(props: DateItemProps) {
  const { config, dateInfo, setDateInfo } = props;

  // 获取年份区间列表
  let initialSlide = 0;
  const start = dayjs(config.min).year();
  const end = dayjs(config.max).year();
  const yearList: React.ReactNode[] = [];
  let index = 0;
  for (let year = start; year <= end; year++) {
    if (dateInfo.current.year() === year) {
      initialSlide = index;
    }
    yearList.push(
      <RowCenter css={style.item} key={year}>
        {year}
        <span css={style.unit}>年</span>
      </RowCenter>
    );
    index++;
  }

  /**
   * swiper配置函数
   */
  const swiperOption: SwiperOptions = {
    initialSlide,
    on: {
      slideChangeTransitionEnd(this: Swiper) {
        setDateInfo({
          current: dateInfo.current.year(start + this.realIndex)
        });
      }
    }
  };

  useEffect(()=>{
    console.log('year', dateInfo.current.year());
  });

  return (
    <ScrollSnap
      extra={<Extra />}
      css={style.swiperContainer}
      swiperOption={swiperOption}
    >
      {yearList}
    </ScrollSnap>
  );
}
