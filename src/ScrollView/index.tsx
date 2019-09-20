import React, { useRef, useEffect } from "react";
import {
  ScrollBinderOption,
  ScrollBinder
} from "../../libs/ScrollView/ScrollBinder";
import { is } from "../is";

export interface ScrollViewProps extends ScrollBinderOption {
  children?: React.ReactNode;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ScrollView(props: ScrollViewProps) {
  const id = is.undefined(props.id) ? undefined : props.id;
  const className = is.undefined(props.className) ? undefined : props.className;
  const style = is.undefined(props.style) ? undefined : props.style;
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {

    let binder: ScrollBinder | null = new ScrollBinder({
      ...props,
      target: container.current
    } as ScrollBinderOption);
    return () => {
      binder = null;
    };
  });

  return (
    <div ref={container} id={id} className={className} style={style}>
      <div>{props.children}</div>
    </div>
  );
}
