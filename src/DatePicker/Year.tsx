/** @jsx jsx */
import { jsx } from "@emotion/core";

import { ScrollSnap } from "./ScrollSnap";
import dayjs from "dayjs";
import { useContext } from "react";
import { dpContext } from "./context";

export function Year() {
  const { min, max, value, setValue } = useContext(dpContext);

  // 获取年份区间列表
  let initialSlide = 0;
  const start = dayjs(min).year();
  const end = dayjs(max).year();
  let index = 0;
  for (let year = start; year <= end; year++) {
    if (value!.year() === year) {
      initialSlide = index;
    }
    index++;
  }

  /**
   * 年份改变时触发函数
   * @param index
   */
  const yearChange = (index: number) => {
    setValue!(value!.year(start + index));
  };

  return (
    <ScrollSnap
      mode="y"
      start={start}
      end={end}
      slideIndex={initialSlide}
      onIndexChange={yearChange}
    />
  );
}
