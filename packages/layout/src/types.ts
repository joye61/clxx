import {
  FlexWrapProperty,
  JustifyContentProperty,
  AlignItemsProperty
} from "csstype";

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
