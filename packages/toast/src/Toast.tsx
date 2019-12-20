/** @jsx jsx */
import { jsx, SerializedStyles } from "@emotion/core";
import React, { useState, useEffect } from "react";
import { style, hideAnimation } from "./style";

export interface ToastProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  onEnd?: () => void;
  content: React.ReactNode;
  position?: "top" | "middle" | "bottom";
  duration?: number;
  rounded?: boolean;
}

export function Toast(props: ToastProps) {
  const {
    content = "",
    position = "middle",
    duration = 3000,
    rounded = true,
    onEnd = () => {},
    ...attributes
  } = props;

  const [animation, setAnimation] = useState<SerializedStyles>(
    style.containerShow
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAnimation(style.containerHide);
    }, duration);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  let showContent: any;
  if (React.isValidElement(content)) {
    showContent = content;
  } else {
    showContent = (
      <p className="cl-Toast-content" css={style.content(rounded)}>
        {content}
      </p>
    );
  }

  const animationEnd = (event: React.AnimationEvent<HTMLDivElement>) => {
    if (event.animationName === hideAnimation.name) {
      typeof onEnd === "function" && onEnd();
    }
  };

  return (
    <div
      css={[style.container, style[position], animation]}
      onAnimationEnd={animationEnd}
      {...attributes}
    >
      {showContent}
    </div>
  );
}
