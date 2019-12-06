/** @jsx jsx */
import { jsx } from "@emotion/core";
import { DateItemProps } from "./types";
import { ScrollSnap } from "../ReactSwiper/ScrollSnap";
import { Extra } from "./Extra";
import { style } from "./style";
import { RowCenter } from "../Layout/Row";
import { prefix0 } from "./util";
import { useState } from "react";
import { SwiperOptions } from "swiper";

export function HIS(props: DateItemProps & { mode: "h" | "i" | "s" }) {
  const { config, dateInfo, setDateInfo, mode } = props;

  let start: number = 0;
  let end: number = 0;
  let unit: string = "";
  if (mode === "h") {
    start = 0;
    end = 23;
    unit = "时";
  } else if (mode === "i") {
    start = 0;
    end = 59;
    unit = "分";
  } else if (mode === "s") {
    start = 0;
    end = 59;
    unit = "秒";
  }

  const list: React.ReactNode[] = [];
  let initialSlide = 0;
  let index = 0;
  for (let i = start; i <= end; i++) {
    if (
      (mode === "h" && dateInfo.current.hour() === i) ||
      (mode === "i" && dateInfo.current.minute() === i) ||
      (mode === "s" && dateInfo.current.second() === i)
    ) {
      initialSlide = index;
    }
    list.push(
      <RowCenter css={style.item} key={i}>
        {prefix0(i)}
        <span css={style.unit}>{unit}</span>
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
      {list}
    </ScrollSnap>
  );
}
