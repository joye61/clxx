import { SizeInfo } from "./types";

export function correctOffset(
  offsetX: number,
  offsetY: number,
  size: SizeInfo
) {
  if (offsetX > 0) offsetX = 0;
  if (offsetY > 0) offsetY = 0;
  const minX = size.containerWidth - size.contentWidth;
  const minY = size.containerHeight - size.contentHeight;
  if (offsetX < minX) offsetX = minX;
  if (offsetY < minY) offsetY = minY;

  return { offsetX, offsetY };
}
