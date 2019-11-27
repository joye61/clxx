import {
  FlexWrapProperty,
  JustifyContentProperty,
  AlignItemsProperty,
  FlexDirectionProperty
} from "csstype";
import { ObjectInterpolation } from "@emotion/core";

export interface FlexContainerProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  wrap?: FlexWrapProperty;
  justify?: JustifyContentProperty;
  align?: AlignItemsProperty;
  children?: React.ReactNode;
}

export interface FlexXYProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  wrap?: FlexWrapProperty;
  align?: AlignItemsProperty;
  children?: React.ReactNode;
}

export function useXYStyles(
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
