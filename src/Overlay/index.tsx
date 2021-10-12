/**@jsx jsx */
import { jsx, ArrayInterpolation, Theme } from "@emotion/react";
import React, { useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";
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

  const [mount, setMount] = useState<HTMLElement | null>(null);
  const [innerWidth, setInnerWidth] = useState<number>(window.innerWidth);

  useLayoutEffect(() => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    setMount(container);
    return () => {
      ReactDOM.unmountComponentAtNode(container);
      container.remove();
    };
  }, []);

  // 页面大小变化时，innerWidth也会更新
  useWindowResize(() => {
    setInnerWidth(window.innerWidth);
  });

  // 挂载对象未生成之前，不显示
  if (!mount) return mount;

  const ctx = getContextValue() as ContextValue;
  const style: ArrayInterpolation<Theme> = [];
  if (fullScreen) {
    // 获取宽度
    let width = innerWidth;
    if (width >= ctx.maxScreenWidth) {
      width = ctx.maxScreenWidth;
    } else if (width <= ctx.minScreenWidth) {
      width = ctx.minScreenWidth;
    }
    style.push({
      zIndex: 9999,
      position: "fixed",
      top: 0,
      left: "50%",
      marginLeft: `-${width / 2}px`,
      width: `${width}px`,
      height: "100%",
      maxWidth: `${ctx.maxScreenWidth}px`,
      minWidth: `${ctx.minScreenWidth}px`,
      backgroundColor: `rgba(0, 0, 0, .6)`,
    });
  }
  if (centerContent) {
    style.push({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    });
  }

  return ReactDOM.createPortal(
    <div css={style} {...extra}>
      {children}
    </div>,
    mount
  );
}
