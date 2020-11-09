import React from "react";
import { useRef, useState, useEffect, CSSProperties } from "react";

/**
 * 可触摸元素的属性，兼容PC
 */
export interface ClickableProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  // 包裹元素的子元素
  children: React.ReactNode;
  // 是否允许冒泡
  bubble: boolean;
  // 激活时的类
  activeClass: string;
  // 激活时的样式
  activeStyle: React.CSSProperties;
  // 禁用点击态行为
  disable: boolean;
}

export function Clickable(props: Partial<ClickableProps>) {
  let {
    children,
    bubble = true,
    className,
    activeClass,
    style,
    activeStyle,
    disable = false,
    ...attrs
  } = props;

  // 如果激活样式和激活类都不存在，则设置激活默认样式
  if (!activeClass && !activeStyle) {
    activeStyle = {
      opacity: 0.6,
    };
  }

  const [boxClass, setBoxClass] = useState<undefined | string>(className);
  const [boxStyle, setBoxStyle] = useState<CSSProperties | undefined>(style);

  // 是否正处于触摸状态
  const isTouch = useRef<boolean>(false);

  // 开始触摸时触发
  const start = (event: React.TouchEvent | React.MouseEvent) => {
    // 只有非触摸状态才能激活
    if (!isTouch.current) {
      // 设置正在触摸状态
      isTouch.current = true;
      // 阻止冒泡
      if (!bubble) {
        event.stopPropagation();
      }

      // 如果激活类存在
      if (typeof activeClass === "string") {
        setBoxClass(
          typeof boxClass === "string"
            ? `${boxClass} ${activeClass}`
            : activeClass
        );
      }

      // 如果激活样式存在
      if (typeof activeStyle === "object") {
        setBoxStyle(
          typeof boxStyle === "object"
            ? { ...boxStyle, ...activeStyle }
            : activeStyle
        );
      }
    }
  };

  // 触摸结束时触发，cancel和end都认为是结束
  const end = () => {
    if (isTouch.current) {
      isTouch.current = false;
      setBoxClass(className);
      setBoxStyle(style);
    }
  };

  // 判断是否是触摸环境
  const isTouchEnvironment = window.ontouchstart !== undefined;

  useEffect(() => {
    if (!disable && !isTouchEnvironment) {
      const handleMouseUp = () => {
        if (isTouch.current) {
          isTouch.current = false;
          setBoxClass(className);
          setBoxStyle(style);
        }
      };
      document.documentElement.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.documentElement.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [className, style]);

  const fullAttrs: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > = {
    ...attrs,
    className: boxClass,
    style: boxStyle,
  };

  // 非禁用状态有点击态行为
  if (!disable) {
    if (isTouchEnvironment) {
      // 当前如果是触摸环境
      fullAttrs.onTouchStart = start;
      fullAttrs.onTouchEnd = end;
      fullAttrs.onTouchCancel = end;
    } else {
      fullAttrs.onMouseDown = start;
    }
  }

  return <div {...fullAttrs}>{children}</div>;
}
