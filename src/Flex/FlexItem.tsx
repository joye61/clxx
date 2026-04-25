import * as CSS from 'csstype';

export interface FlexItemProps extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode;
  alignSelf?: CSS.Property.AlignSelf;
  order?: CSS.Property.Order;
  flex?: CSS.Property.BoxFlex;
  flexGrow?: CSS.Property.FlexGrow;
  flexShrink?: CSS.Property.FlexShrink;
  flexBasis?: CSS.Property.FlexBasis;
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
    style,
    ...extra
  } = props;
  // 布局属性走原生 inline style：避免 emotion 在每次 render 哈希对象字面量
  const inlineStyle: React.CSSProperties = {
    alignSelf,
    order,
    flex,
    flexGrow,
    flexShrink,
    flexBasis,
    ...style,
  };
  return (
    <div style={inlineStyle} {...extra}>
      {children}
    </div>
  );
}
