import { SerializedStyles } from "@emotion/core";
import React, { useState, useEffect } from "react";
import { style, hideAnimation } from "./style";

export interface ToastComponentProps<T> {
  onEnd?: () => void;
  content: T;
  position?: "top" | "middle" | "bottom";
  duration?: number;
}

export function ToastComponent<T>({
  content,
  position = "bottom",
  duration = 3000,
  onEnd = () => {}
}: ToastComponentProps<T>) {
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
    showContent = <p css={style.content}>{content}</p>;
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
    >
      {showContent}
    </div>
  );
}
