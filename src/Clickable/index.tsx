import React, {
  HTMLProps,
  useEffect,
  useRef,
  MutableRefObject
} from "react";
import { Activable } from "../Activable";

export interface ClickableProps {
  // target参数
  className?: string;
  id?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;

  // Activable可接收参数
  activeStyle?: React.CSSProperties;
  activeClass?: string;
  onClick?: () => void;
  bubblable?: boolean;
}

export function Clickable(props: ClickableProps) {
  const targetRef = useRef<HTMLDivElement>();

  // 一旦挂载成功，立即绑定相应事件处理逻辑
  useEffect(() => {
    const actor = new Activable({
      target: targetRef.current as HTMLDivElement,
      activeClass: props.activeClass,
      activeStyle: props.activeStyle,
      bubblable: props.bubblable,
      onClick: props.onClick
    });

    return () => actor.destroy();
  });

  let containerProps: HTMLProps<HTMLDivElement> = {
    className: props.className,
    id: props.id,
    style: props.style
  };

  return (
    <div
      {...containerProps}
      ref={targetRef as MutableRefObject<HTMLDivElement>}
    >
      {props.children}
    </div>
  );
}
