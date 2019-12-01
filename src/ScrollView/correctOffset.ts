import { SizeInfo, ScrollViewState, ScrollDirection } from "./types";
import { Dispatch, SetStateAction } from "react";

export function correctOffset(
  offsetX: number,
  offsetY: number,
  size: SizeInfo,
  direction: ScrollDirection,
  state: ScrollViewState,
  setState: Dispatch<SetStateAction<ScrollViewState>>
) {
  if (offsetX > 0) offsetX = 0;
  if (offsetY > 0) offsetY = 0;
  const minX = size.containerWidth - size.contentWidth;
  const minY = size.containerHeight - size.contentHeight;
  if (offsetX < minX) offsetX = minX;
  if (offsetY < minY) offsetY = minY;

  // 如果到达临界点，需要停止惯性滚动
  if (
    (direction === "horizontal" && (offsetX === 0 || offsetX === minX)) ||
    (direction === "vertical" && (offsetY === 0 || offsetY === minY))
  ) {
    setState({ ...state, runInertia: false });
  }
  return { offsetX, offsetY };
}
