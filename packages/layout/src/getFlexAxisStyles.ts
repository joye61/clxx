import { JustifyContentProperty, FlexDirectionProperty } from "csstype";
import { ObjectInterpolation } from "@emotion/core";
import { FlexXYProps } from "./types";

/**
 * 分解某一个flex轴向上的样式和属性
 * @param props 
 * @param direction 
 * @param justify 
 */
export function getFlexAxisStyles(
  props: FlexXYProps,
  direction: FlexDirectionProperty,
  justify: JustifyContentProperty
) {
  const { wrap, align, ...attributes } = props;
  const styles: ObjectInterpolation<any> = {
    display: "flex",
    alignItems: "center",
    flexDirection: direction,
    flexWrap: wrap,
    justifyContent: justify
  };
  if (align) {
    styles.alignItems = align;
  }
  return { styles, attributes };
}
