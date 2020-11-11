import type * as CSS from "csstype";

export interface LayoutProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  children?: React.ReactNode;
}


export interface PositionProperty {
  position: CSS.Property.Position;
  top: CSS.Property.Top;
  left: CSS.Property.Left;
  right: CSS.Property.Right;
  bottom: CSS.Property.Bottom;
  width: CSS.Property.Width;
  height: CSS.Property.Height;
}

export interface FlexBoxProperty {
  alignItems: CSS.Property.AlignItems;
  justifyContent: CSS.Property.JustifyContent;
  flexDirection: CSS.Property.FlexDirection;
  flexWrap: CSS.Property.FlexWrap;
  alignContent: CSS.Property.AlignContent;
  flexFlow: CSS.Property.FlexFlow;
}

export interface FlexItemProperty {
  flex: CSS.Property.Flex;
  flexGrow: CSS.Property.FlexGrow;
  flexShrink: CSS.Property.FlexShrink;
  flexBasis: CSS.Property.FlexBasis;
  order: CSS.Property.Order;
  alignSelf: CSS.Property.AlignSelf;
}