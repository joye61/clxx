/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useRef } from "react";

export function ImagePreview(
  props: React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
) {
  const imgRef = useRef<HTMLImageElement>(null);
  return <img {...props} ref={imgRef} />;
}
