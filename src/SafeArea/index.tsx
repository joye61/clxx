/** @jsx jsx */
import { Interpolation, jsx, Theme } from "@emotion/react";
import { useEffect } from "react";

export interface SafeAreaProps extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode;
  // 目前只支持常见的顶部和底部
  type: "top" | "bottom";
}

export function SafeArea(props: SafeAreaProps) {
  const { children, type = "bottom", ...extra } = props;

  useEffect(() => {
    let meta: HTMLMetaElement | null = document.querySelector(
      "meta[name='viewport']"
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content = "width=device-width, initial-scale=1, viewport-fit=cover";
      document.head.prepend(meta);
    } else {
      // 解析meta.content TODO
    }
  }, []);

  let boxCss: Interpolation<Theme>;
  if (type === "top") {
    boxCss = {
      height: [`constant(safe-area-inset-top)`, `env(safe-area-inset-top)`],
    };
  } else if (type === "bottom") {
    boxCss = {
      height: [
        `constant(safe-area-inset-bottom)`,
        `env(safe-area-inset-bottom)`,
      ],
    };
  }

  return (
    <div css={boxCss} {...extra}>
      {children}
    </div>
  );
}
