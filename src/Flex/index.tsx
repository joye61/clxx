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

export function Flex(props: FlexProps) {
  const {
    children,
    alignItems = 'center',
    alignContent,
    justifyContent,
    flexFlow,
    flexWrap,
    flexDirection,
    style,
    ...extra
  } = props;
  // 布局属性走原生 inline style：避免 emotion 在每次 render 哈希对象字面量
  const inlineStyle: React.CSSProperties = {
    display: 'flex',
    alignItems,
    alignContent,
    justifyContent,
    flexFlow,
    flexWrap,
    flexDirection,
    ...style,
  };
  return (
    <div style={inlineStyle} {...extra}>
      {children}
    </div>
  );
}

export type { FlexItemProps } from './FlexItem';
export { FlexItem } from './FlexItem';

