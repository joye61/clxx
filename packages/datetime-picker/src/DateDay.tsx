/** @jsx jsx */
import { jsx } from "@emotion/core";
import { ScrollSnap } from "./ScrollSnap";
import { useContext } from "react";
import { dpContext } from "./context";

export function DateDay() {
  const { value, setValue } = useContext(dpContext);

  const start = 1;
  const end = value!.endOf("month").date();
  let initialSlide = 0;
  let index = 0;
  for (let date = start; date <= end; date++) {
    if (value!.date() === date) {
      initialSlide = index;
    }
    index++;
  }

  const dateChange = (index: number) => {
    setValue!(value!.date(start + index));
  };

  return (
    <ScrollSnap
      mode="d"
      start={start}
      end={end}
      slideIndex={initialSlide}
      onIndexChange={dateChange}
    />
  );
}
