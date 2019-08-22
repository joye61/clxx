/** @jsx jsx */
import { jsx, SerializedStyles } from "@emotion/core";
import React, { useState } from "react";
import { style, hideAnimation } from "./style";

type Callback = () => void;
export interface AlertComponentProps<T> {
  content: T;
  showMask?: boolean;
  showCancel?: boolean;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: Callback;
  onCancel?: Callback;
  onHide?: Callback;
}

export function AlertComponent<T>({
  content,
  showMask = true,
  showCancel = false,
  cancelText = "取消",
  confirmText = "确定",
  onConfirm = () => {},
  onCancel = () => {},
  onHide = () => {}
}: AlertComponentProps<T>) {
  // 动画状态类
  const [animation, setAnimation] = useState<SerializedStyles>(
    style.containerShow
  );

  // 动画结束回调
  const animationEnd = (event: React.AnimationEvent) => {
    if (hideAnimation.name === event.animationName) {
      typeof onHide === "function" && onHide();
    }
  };

  // 取消按钮点击
  const cancel = () => {
    setAnimation(style.containerHide);
    typeof onCancel === "function" && onCancel();
  };

  // 确认按钮点击
  const confirm = () => {
    setAnimation(style.containerHide);
    typeof onConfirm === "function" && onConfirm();
  };

  // 显示弹框内容
  let showContent: any;
  if (React.isValidElement(content)) {
    showContent = content;
  } else {
    showContent = <p css={style.content}>{content}</p>;
  }

  const wrapperCss = [style.alert];
  if (showMask) {
    wrapperCss.push(style.alertMask);
  }

  return (
    <div css={wrapperCss}>
      <div css={[style.container, animation]} onAnimationEnd={animationEnd}>
        {showContent}
        <div css={style.btn}>
          {showCancel ? (
            <div css={style.cancel} onClick={cancel} onTouchStart={() => {}}>
              {cancelText}
            </div>
          ) : null}
          <div css={style.confirm} onClick={confirm} onTouchStart={() => {}}>
            {confirmText}
          </div>
        </div>
      </div>
    </div>
  );
}
