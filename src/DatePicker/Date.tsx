/** @jsx jsx */
import { jsx } from "@emotion/core";
import { DateItemProps } from "./types";
import { ScrollSnap } from "../ReactSwiper/ScrollSnap";
import { Extra } from "./Extra";
import { style } from "./style";
import dayjs from "dayjs";
import { RowCenter } from "../Layout/Row";
import { prefix0 } from "./util";
import { useState } from "react";
import { SwiperOptions } from "swiper";

export function DDate(props: DateItemProps) {
  const { config, dateInfo, setDateInfo } = props;

  const start = 1;
  const end = dateInfo.current.endOf("month").date();
	const dateList: React.ReactNode[] = [];
	let initialSlide = 0;
  let index = 0;
  for (let date = start; date <= end; date++) {
    if (dateInfo.current.date() === date) {
      initialSlide = index;
    }
    dateList.push(
      <RowCenter css={style.item} key={date}>
        {prefix0(date)}
        <span css={style.unit}>月</span>
      </RowCenter>
    );
    index++;
  }

  const [option, setOption] = useState<SwiperOptions>({
    initialSlide,
    on: {
      slideChangeTransitionEnd() {
        console.log(this);
        console.log("slideChangeTransitionEnd");
      }
    }
  });

  return (
    <ScrollSnap
      extra={<Extra />}
      css={style.swiperContainer}
      swiperOption={option}
    >
      {dateList}
    </ScrollSnap>
  );
}
