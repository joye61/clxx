/** @jsx jsx */
import { jsx } from "@emotion/core";

import { LayoutProps, PositionProperty } from "./types";

type PositionProps = LayoutProps & Partial<PositionProperty>;

/**
 * 定位相关
 * @param props
 */
export function Position(props: PositionProps) {
  const {
    children,
    position,
    top,
    left,
    right,
    bottom,
    width,
    height,
    ...attrs
  } = props;
  return (
    <div css={{ position, top, left, right, bottom, width, height }} {...attrs}>
      {children}
    </div>
  );
}

export function Absolute(props: PositionProps) {
  const { position = "absolute", ...others } = props;
  return <Position position={position} {...others} />;
}
export function Relative(props: PositionProps) {
  const { position = "relative", ...others } = props;
  return <Position position={position} {...others} />;
}
export function Fixed(props: PositionProps) {
  const { position = "fixed", ...others } = props;
  return <Position position={position} {...others} />;
}
export function Sticky(props: PositionProps) {
  const { position = "sticky", ...others } = props;
  return <Position position={position} {...others} />;
}
