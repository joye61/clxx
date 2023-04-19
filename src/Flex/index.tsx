import * as CSS from 'csstype';

export interface FlexProps extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode;
  alignItems?: CSS.Property.AlignItems;
  alignContent?: CSS.Property.AlignContent;
  justifyContent?: CSS.Property.JustifyContent;
  flexFlow?: CSS.Property.FlexFlow;
  flexWrap?: CSS.Property.FlexWrap;
  flexDirection?: CSS.Property.FlexDirection;
}

export interface FlexItemProps extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode;
  alignSelf?: CSS.Property.AlignSelf;
  order?: CSS.Property.Order;
  flex?: CSS.Property.BoxFlex;
  flexGrow?: CSS.Property.FlexGrow;
  flexShrink?: CSS.Property.FlexShrink;
  flexBasis?: CSS.Property.FlexBasis;
}

export function Flex(props: FlexProps) {
  const {
    children,
    alignItems = 'center',
    alignContent,
    justifyContent,
    flexFlow,
    flexWrap,
    flexDirection,
    ...extra
  } = props;
  return (
    <div
      css={{
        display: 'flex',
        alignItems,
        alignContent,
        justifyContent,
        flexFlow,
        flexWrap,
        flexDirection,
      }}
      {...extra}
    >
      {children}
    </div>
  );
}

export function FlexItem(props: FlexItemProps) {
  const {
    children,
    alignSelf,
    order,
    flex,
    flexGrow,
    flexShrink,
    flexBasis,
    ...extra
  } = props;
  return (
    <div
      css={{
        alignSelf,
        order,
        flex,
        flexGrow,
        flexShrink,
        flexBasis,
      }}
      {...extra}
    >
      {children}
    </div>
  );
}
