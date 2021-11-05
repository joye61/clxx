/**@jsx jsx */
import { jsx, ArrayInterpolation, Theme } from "@emotion/react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { getContextValue } from "../context";
import { ContextValue } from "../context";
import { useWindowResize } from "../Effect/useWindowResize";

export interface OverlayProps extends React.HTMLProps<HTMLDivElement> {
  // 挂载元素的子元素
  children?: React.ReactNode;
  // 挂载位置，是否挂载到外部
  outside?: boolean;
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
    outside = false,
    centerContent = true,
    fullScreen = true,
    maskColor = "rgba(0, 0, 0, .6)",
    ...extra
  } = props;

  const [mount, setMount] = useState<HTMLDivElement | null>(null);
  const [innerWidth, setInnerWidth] = useState<number>(window.innerWidth);

  // 这里是为了修复一个非挂载状态触发resize事件的bug
  const isUnmount = useRef<boolean | null>(false);
  useEffect(() => {
    return () => {
      isUnmount.current = true;
    };
  }, []);

  useLayoutEffect(() => {
    if (outside) {
      const div = document.createElement("div");
      document.body.appendChild(div);
      setMount(div);

      return () => {
        // ReactDOM.unmountComponentAtNode(div);
        div.remove();
      };
    }
  }, [outside]);

  // 页面大小变化时，innerWidth也会更新
  useWindowResize(() => {
    if (!isUnmount.current) {
      setInnerWidth(window.innerWidth);
    }
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

  const content = (
    <div css={style} {...extra}>
      {children}
    </div>
  );

  /**
   * 如果是挂载到当前位置，直接返回
   */
  if (!outside) {
    return content;
  }

  /**
   * 如果是挂载到外部，但是挂载点还没准备好，返回空
   */
  if (!mount) {
    return null;
  }

  /**
   * 挂载到外部，且挂载点已经准备好
   */
  return ReactDOM.createPortal(content, mount);
}
