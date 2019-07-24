import React, { useState, useEffect } from "react";

type Callback = () => void;
export interface ToastComponentProps {
  content: string | React.Component;
  duration?: number;
  onEnd?: Callback;
}

export function ToastComponent({
  content,
  duration = 3000,
  onEnd = () => {}
}: ToastComponentProps) {
  const [animationClass, setAnimationClass] = useState<string>(
    "cl-Toast cl-Toast-show"
  );

  // 约定时间之后自动清理Toast
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAnimationClass("cl-Toast cl-Toast-hide");
    }, duration);
    () => {
      window.clearTimeout(timer);
    };
  });

  // 动画结束时执行
  const animationEnd = (event: React.AnimationEvent) => {
    if (event.animationName === "cl-Toast-hide") {
      typeof onEnd === "function" && onEnd();
    }
  };

  return (
    <div className={animationClass} onAnimationEnd={animationEnd}>
      {content}
    </div>
  );
}
