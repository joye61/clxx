import { CSSObject } from "@emotion/react";

export interface FixedProps extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

// 模块级常量：4 种 position 的样式静态、与 props 无关，只哈希一次
const baseStyle: CSSObject = {
  position: "fixed",
  // 与 Container 的 maxWidth 联动，PC 端 fixed 元素也水平居中限宽
  maxWidth: "var(--clxx-max-width, 100%)",
};

const positionStyles: Record<NonNullable<FixedProps["position"]>, CSSObject> = {
  top: {
    ...baseStyle,
    top: 0,
    width: "100%",
    left: "50%",
    transform: "translateX(-50%)",
  },
  bottom: {
    ...baseStyle,
    bottom: 0,
    width: "100%",
    left: "50%",
    transform: "translateX(-50%)",
  },
  left: {
    ...baseStyle,
    top: 0,
    left: "50%",
    height: "100%",
    transform: "translateX(calc(var(--clxx-max-width, 100vw) / -2))",
  },
  right: {
    ...baseStyle,
    top: 0,
    left: "50%",
    height: "100%",
    transform: "translateX(calc(var(--clxx-max-width, 100vw) / 2 - 100%))",
  },
};

export function Fixed(props: FixedProps) {
  const { children, position = "bottom", ...extra } = props;
  return (
    <div {...extra} css={positionStyles[position]}>
      {children}
    </div>
  );
}
