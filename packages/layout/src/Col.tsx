/** @jsx jsx */
import { jsx, ObjectInterpolation } from "@emotion/core";
import { FlexContainerProps, FlexXYProps } from "./types";
import { getFlexAxisStyles } from "./getFlexAxisStyles";

/**
 * 垂直flex容器
 * @param props
 */
export function Col(props: FlexContainerProps) {
  const { wrap, justify, align, ...attributes } = props;
  const styles: ObjectInterpolation<any> = {
    display: "flex",
    flexDirection: "column",
    flexWrap: wrap,
    justifyContent: justify,
    alignItems: align
  };

  return (
    <div css={styles} {...attributes}>
      {props.children}
    </div>
  );
}

/**
 * 水平flex，元素around，默认纵轴居中
 * @param props
 */
export function ColAround(props: FlexXYProps) {
  const { styles, attributes } = getFlexAxisStyles(
    props,
    "column",
    "space-around"
  );
  return (
    <div css={styles} {...attributes}>
      {props.children}
    </div>
  );
}

/**
 * 水平flex，元素center，默认纵轴居中
 * @param props
 */
export function ColCenter(props: FlexXYProps) {
  const { styles, attributes } = getFlexAxisStyles(props, "column", "center");
  return (
    <div css={styles} {...attributes}>
      {props.children}
    </div>
  );
}

/**
 * 水平flex，元素between，默认纵轴居中
 * @param props
 */
export function ColBetween(props: FlexXYProps) {
  const { styles, attributes } = getFlexAxisStyles(
    props,
    "column",
    "space-between"
  );
  return (
    <div css={styles} {...attributes}>
      {props.children}
    </div>
  );
}

/**
 * 水平flex，元素开始，默认纵轴居中
 * @param props
 */
export function ColStart(props: FlexXYProps) {
  const { styles, attributes } = getFlexAxisStyles(
    props,
    "column",
    "flex-start"
  );
  return (
    <div css={styles} {...attributes}>
      {props.children}
    </div>
  );
}

/**
 * 水平flex，元素结尾，默认纵轴居中
 * @param props
 */
export function ColEnd(props: FlexXYProps) {
  const { styles, attributes } = getFlexAxisStyles(props, "column", "flex-end");
  return (
    <div css={styles} {...attributes}>
      {props.children}
    </div>
  );
}
