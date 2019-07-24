import React, { useState } from "react";

type Callback = () => void;
export interface AlertComponentProps {
  content: string | React.ReactElement;
  showMask?: boolean;
  showCancel?: boolean;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: Callback;
  onCancel?: Callback;
  onHide?: Callback;
}

export function AlertComponent({
  content = "",
  showMask = true,
  showCancel = false,
  cancelText = "取消",
  confirmText = "确定",
  onConfirm = () => {},
  onCancel = () => {},
  onHide = () => {}
}: AlertComponentProps) {
  // 动画状态类
  const [animationClass, setAnimationClass] = useState<string>("cl-Alert-show");

  // 动画结束回调
  const animationEnd = (event: React.AnimationEvent) => {
    if (event.animationName === "cl-Alert-hide") {
      typeof onHide === "function" && onHide();
    }
  };

  // 取消按钮点击
  const cancel = () => {
    setAnimationClass("cl-Alert-hide");
    typeof onCancel === "function" && onCancel();
  };

  // 确认按钮点击
  const confirm = () => {
    setAnimationClass("cl-Alert-hide");
    typeof onConfirm === "function" && onConfirm();
  };

  // 显示弹框内容
  const showContent = () => {
    if (typeof content === "string") {
      return <p className="cl-Alert-content">{content}</p>;
    }
    if (React.isValidElement(content)) {
      return content;
    }
  };

  let className = "cl-Alert";
  if (showMask) {
    className = "cl-Alert cl-Alert-mask";
  }

  return (
    <div className={className}>
      <div
        className={`cl-Alert-container ${animationClass}`}
        onAnimationEnd={animationEnd}
      >
        {showContent()}
        <div className="cl-Alert-btn">
          {showCancel ? (
            <div
              className="cl-Alert-cancel"
              onClick={cancel}
              onTouchStart={() => {}}
            >
              {cancelText}
            </div>
          ) : null}
          <div
            className="cl-Alert-confirm"
            onClick={confirm}
            onTouchStart={() => {}}
          >
            {confirmText}
          </div>
        </div>
      </div>
    </div>
  );
}
