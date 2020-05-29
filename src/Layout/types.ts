import type * as CSS from "csstype";

export interface LayoutProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  children?: React.ReactNode;
}

export interface PositionProperty {
  position: CSS.PositionProperty;
  top: CSS.TopProperty<any>;
  left: CSS.LeftProperty<any>;
  right: CSS.RightProperty<any>;
  bottom: CSS.BottomProperty<any>;
  width: CSS.WidthProperty<any>;
  height: CSS.HeightProperty<any>;
}

export interface FlexBoxProperty {
  alignItems: CSS.AlignItemsProperty;
  justifyContent: CSS.JustifyContentProperty;
  flexDirection: CSS.FlexDirectionProperty;
  flexWrap: CSS.FlexWrapProperty;
  alignContent: CSS.AlignContentProperty;
  flexFlow: CSS.FlexFlowProperty;
}

export interface FlexItemProperty {
  flex: CSS.FlexProperty<any>;
  flexGrow: CSS.FlexBasisProperty<any>;
  flexShrink: CSS.FlexProperty<any>;
  flexBasis: CSS.FlexBasisProperty<any>;
  order: number;
  alignSelf: CSS.AlignSelfProperty;
}
