/** @jsx jsx */
import { jsx } from "@emotion/core";

import type { LayoutProps, FlexBoxProperty, FlexItemProperty } from "./types";

type FlexBoxProps = LayoutProps & Partial<FlexBoxProperty>;
type FlexItemProps = LayoutProps & Partial<FlexItemProperty>;

/**
 * 弹性容器
 * @param props
 */
export function FlexBox(props: FlexBoxProps) {
  const {
    children,
    // 默认任意方向的纵轴都居中显示
    alignItems = "center",
    flexDirection,
    justifyContent,
    flexWrap,
    alignContent,
    flexFlow,
    ...attrs
  } = props;
  return (
    <div
      css={{
        display: "flex",
        flexDirection,
        alignItems,
        justifyContent,
        flexWrap,
        alignContent,
        flexFlow,
      }}
      {...attrs}
    >
      {children}
    </div>
  );
}

/**
 * 弹性元素
 * @param props
 */
export function FlexItem(props: FlexItemProps) {
  const {
    children,
    flex,
    flexBasis,
    flexGrow,
    flexShrink,
    order,
    alignSelf,
    ...attrs
  } = props;
  return (
    <div
      css={{
        flex,
        flexBasis,
        flexGrow,
        flexShrink,
        order,
        alignSelf,
      }}
      {...attrs}
    >
      {children}
    </div>
  );
}

export function Row(props: FlexBoxProps) {
  const { flexDirection = "row", ...others } = props;
  return <FlexBox flexDirection={flexDirection} {...others} />;
}

export function Col(props: FlexBoxProps) {
  const { flexDirection = "column", ...others } = props;
  return <FlexBox flexDirection={flexDirection} {...others} />;
}

export function RowAround(props: FlexBoxProps) {
  const { justifyContent = "space-around", ...others } = props;
  return <FlexBox justifyContent={justifyContent} {...others} />;
}
export function RowBetween(props: FlexBoxProps) {
  const { justifyContent = "space-between", ...others } = props;
  return <FlexBox justifyContent={justifyContent} {...others} />;
}
export function RowEvenly(props: FlexBoxProps) {
  const { justifyContent = "space-evenly", ...others } = props;
  return <FlexBox justifyContent={justifyContent} {...others} />;
}
export function RowCenter(props: FlexBoxProps) {
  const { justifyContent = "center", ...others } = props;
  return <FlexBox justifyContent={justifyContent} {...others} />;
}
export function RowStart(props: FlexBoxProps) {
  const { justifyContent = "flex-start", ...others } = props;
  return <FlexBox justifyContent={justifyContent} {...others} />;
}
export function RowEnd(props: FlexBoxProps) {
  const { justifyContent = "flex-end", ...others } = props;
  return <FlexBox justifyContent={justifyContent} {...others} />;
}

export function ColAround(props: FlexBoxProps) {
  const {
    flexDirection = "column",
    justifyContent = "space-around",
    ...others
  } = props;
  return (
    <FlexBox
      flexDirection={flexDirection}
      justifyContent={justifyContent}
      {...others}
    />
  );
}
export function ColBetween(props: FlexBoxProps) {
  const {
    flexDirection = "column",
    justifyContent = "space-between",
    ...others
  } = props;
  return (
    <FlexBox
      flexDirection={flexDirection}
      justifyContent={justifyContent}
      {...others}
    />
  );
}
export function ColEvenly(props: FlexBoxProps) {
  const {
    flexDirection = "column",
    justifyContent = "space-evenly",
    ...others
  } = props;
  return (
    <FlexBox
      flexDirection={flexDirection}
      justifyContent={justifyContent}
      {...others}
    />
  );
}
export function ColCenter(props: FlexBoxProps) {
  const {
    flexDirection = "column",
    justifyContent = "center",
    ...others
  } = props;
  return (
    <FlexBox
      flexDirection={flexDirection}
      justifyContent={justifyContent}
      {...others}
    />
  );
}
export function ColStart(props: FlexBoxProps) {
  const {
    flexDirection = "column",
    justifyContent = "flex-start",
    ...others
  } = props;
  return (
    <FlexBox
      flexDirection={flexDirection}
      justifyContent={justifyContent}
      {...others}
    />
  );
}
export function ColEnd(props: FlexBoxProps) {
  const {
    flexDirection = "column",
    justifyContent = "flex-end",
    ...others
  } = props;
  return (
    <FlexBox
      flexDirection={flexDirection}
      justifyContent={justifyContent}
      {...others}
    />
  );
}
