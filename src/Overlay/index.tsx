/**@jsx jsx */
import { jsx, ArrayInterpolation, Theme } from "@emotion/react";
import React, { useState } from "react";
import { getContextValue } from "../context";
import { ContextValue } from "../context";
import { useWindowResize } from "../effect/useWindowResize";

export interface OverlayProps extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode;
  // 内容是否居中，默认居中
  centerContent?: boolean;
  // 是否全屏，默认全屏
  fullScreen?: boolean;
  // 遮罩的颜色，只有fullScreen状态生效，默认rgba(0, 0, 0, .6)
  maskColor?: string;
}

/**
 * 覆盖层，可以作为通用遮罩
 * @param props
 * @returns
 */
export function Overlay(props: OverlayProps) {
  const {
    children,
    centerContent = true,
    fullScreen = true,
    maskColor = "rgba(0, 0, 0, .6)",
    ...extra
  } = props;

  const [innerWidth, setInnerWidth] = useState<number>(window.innerWidth);

  // 页面大小变化时，innerWidth也会更新
  useWindowResize(() => {
    setInnerWidth(window.innerWidth);
  });

  const ctx = getContextValue() as ContextValue;
  const style: ArrayInterpolation<Theme> = [];

  // 如果是全屏，设置全屏样式
  if (fullScreen) {
    // 获取宽度
    let width = innerWidth;
    if (width >= ctx.maxDocWidth) {
      width = ctx.maxDocWidth;
    } else if (width <= ctx.minDocWidth) {
      width = ctx.minDocWidth;
    }
    style.push({
      zIndex: 9999,
      position: "fixed",
      top: 0,
      left: "50%",
      marginLeft: `-${width / 2}px`,
      width: `${width}px`,
      height: "100%",
      maxWidth: `${ctx.maxDocWidth}px`,
      minWidth: `${ctx.minDocWidth}px`,
      backgroundColor: maskColor,
    });
  }

  // 如果内容居中，设置内容居中有样式
  if (centerContent) {
    style.push({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    });
  }

  return (
    <div css={style} {...extra}>
      {children}
    </div>
  );
}
