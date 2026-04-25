import { Interpolation, Theme } from "@emotion/react";
import { useViewport } from "../Effect/useViewport";

export interface SafeAreaProps extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode;
  // 目前只支持常见的顶部和底部
  type?: "top" | "bottom";
}

// 模块级常量：避免每次 render 重新分配对象与哈希
const topStyle: Interpolation<Theme> = {
  height: [
    `constant(safe-area-inset-top, 0)`,
    `env(safe-area-inset-top, 0)`,
  ],
};
const bottomStyle: Interpolation<Theme> = {
  height: [
    `constant(safe-area-inset-bottom, 0)`,
    `env(safe-area-inset-bottom, 0)`,
  ],
};

export function SafeArea(props: SafeAreaProps) {
  const { children, type = "bottom", ...extra } = props;

  useViewport({ viewportFit: "cover" });

  const boxCss = type === "top" ? topStyle : bottomStyle;

  return (
    <div css={boxCss} {...extra}>
      {children}
    </div>
  );
}
