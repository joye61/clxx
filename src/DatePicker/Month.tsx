/** @jsx jsx */
import { jsx } from "@emotion/core";
import { DateItemProps } from "./types";
import { ScrollSnap } from "../ReactSwiper/ScrollSnap";
import { Extra } from "./Extra";
import { style } from "./style";
import dayjs from "dayjs";
import { RowCenter } from "../Layout/Row";
import { prefix0 } from "./util";
import { useState, useEffect } from "react";
import { SwiperOptions } from "swiper";

export function Month(props: DateItemProps) {
  const { config, dateInfo, setDateInfo } = props;

  let initialSlide = 0;
  const start = 1;
  const end = 12;
  const monthList: React.ReactNode[] = [];
  let index = 0;
  for (let month = start; month <= end; month++) {
    if (dateInfo.current.month() + 1 === month) {
      initialSlide = index;
    }
    monthList.push(
      <RowCenter css={style.item} key={month}>
        {prefix0(month)}
        <span css={style.unit}>月</span>
      </RowCenter>
    );
    index++;
  }

  const [option, setOption] = useState<SwiperOptions>({
    initialSlide,
    on: {
      slideChangeTransitionEnd() {
        
      }
    }
  });

  useEffect(()=>{
    console.log("month", dateInfo.current.year());
  });

  return (
    <ScrollSnap
      extra={<Extra />}
      css={style.swiperContainer}
      swiperOption={option}
    >
      {monthList}
    </ScrollSnap>
  );
}
