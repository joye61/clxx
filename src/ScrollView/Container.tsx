/** @jsx jsx */
import { jsx, ObjectInterpolation } from "@emotion/core";
import { ContainerProps } from "./types";

export function Container(props: ContainerProps) {
  const { children, height, ...attributes } = props;

  const containerStyle: ObjectInterpolation<any> = {
    position: "relative",
    overflow: "hidden",
    height
  };

  const subStyle: ObjectInterpolation<any> = {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%"
  };

  return (
    <div {...attributes} css={containerStyle}>
      <div css={subStyle}>{children}</div>
    </div>
  );
}
