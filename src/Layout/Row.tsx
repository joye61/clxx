/** @jsx jsx */
import { jsx, ObjectInterpolation } from "@emotion/core";
import { FlexContainerProps, FlexXYProps, useXYStyles } from "./types";

/**
 * 水平flex
 * @param props
 */
export function Row(props: FlexContainerProps) {
  const { wrap, justify, align, ...attributes } = props;
  const styles: ObjectInterpolation<any> = {
    display: "flex",
    flexDirection: "row",
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
export function RowAround(props: FlexXYProps) {
  const { styles, attributes } = useXYStyles(props, "row", "space-around");
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
export function RowCenter(props: FlexXYProps) {
  const { styles, attributes } = useXYStyles(props, "row", "center");
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
export function RowBetween(props: FlexXYProps) {
  const { styles, attributes } = useXYStyles(props, "row", "space-between");
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
export function RowStart(props: FlexXYProps) {
  const { styles, attributes } = useXYStyles(props, "row", "flex-start");
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
export function RowEnd(props: FlexXYProps) {
  const { styles, attributes } = useXYStyles(props, "row", "flex-end");
  return (
    <div css={styles} {...attributes}>
      {props.children}
    </div>
  );
}
