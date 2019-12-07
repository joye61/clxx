/** @jsx jsx */
import { jsx } from "@emotion/core";
import { ScrollSnap } from "./ScrollSnap";
import { useContext } from "react";
import { dpContext } from "./context";

export function HIS(props: { mode: "h" | "i" | "s" }) {
  const mode = props.mode;
  const { value, setValue } = useContext(dpContext);

  let start: number = 0;
  let end: number = 0;
  if (mode === "h") {
    start = 0;
    end = 23;
  } else if (mode === "i") {
    start = 0;
    end = 59;
  } else if (mode === "s") {
    start = 0;
    end = 59;
  }

  let initialSlide = 0;
  let index = 0;
  for (let i = start; i <= end; i++) {
    if (
      (mode === "h" && value!.hour() === i) ||
      (mode === "i" && value!.minute() === i) ||
      (mode === "s" && value!.second() === i)
    ) {
      initialSlide = index;
    }
    index++;
  }

  return (
    <ScrollSnap mode={mode} start={start} end={end} slideIndex={initialSlide} />
  );
}
