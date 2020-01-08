/** @jsx jsx */
import { jsx, Interpolation } from "@emotion/core";
import React, { useState } from "react";
import { style, hideAnimation } from "./style";
import { FixContainer } from "@clxx/layout";

type Callback = () => void;
export interface AlertProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  content: React.ReactNode;
  showMask?: boolean;
  showCancel?: boolean;
  showConfirm?: boolean;
  cancelContent?: React.ReactNode;
  confirmContent?: React.ReactNode;
  onConfirm?: Callback;
  onCancel?: Callback;
  onHide?: Callback;
}

export function Alert(props: AlertProps): React.ReactElement {
  const {
    content,
    showMask = true,
    showCancel = false,
    showConfirm = true,
    cancelContent = "取消",
    confirmContent = "确定",
    onConfirm = () => undefined,
    onCancel = () => undefined,
    onHide = () => undefined,
    ...htmlProps
  } = props;

  // 动画状态类
  const [animation, setAnimation] = useState<Interpolation>(
    style.containerShow
  );
  const [maskAnimation, setMaskAnimation] = useState<Interpolation>(
    style.maskShow
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
    setMaskAnimation(style.maskHide);
    typeof onCancel === "function" && onCancel();
  };

  // 确认按钮点击
  const confirm = () => {
    setAnimation(style.containerHide);
    setMaskAnimation(style.maskHide);
    typeof onConfirm === "function" && onConfirm();
  };

  // 显示弹框内容
  let showContent: React.ReactElement;
  if (React.isValidElement(content)) {
    showContent = content;
  } else {
    showContent = (
      <p css={style.content} className="cl-Alert-content">
        {content}
      </p>
    );
  }

  /**
   * 显示取消按钮
   */
  const cancelBtn = () => {
    if (!showCancel) {
      return null;
    }

    if (React.isValidElement(cancelContent)) {
      return cancelContent;
    }

    return (
      <div
        css={[style.btnItem, style.cancel]}
        onClick={cancel}
        className="cl-Alert-btn-cancel"
        onTouchStart={() => undefined}
      >
        {cancelContent}
      </div>
    );
  };

  /**
   * 显示确定按钮
   */
  const confirmBtn = () => {
    if (!showConfirm) {
      return null;
    }

    if (React.isValidElement(confirmContent)) {
      return confirmContent;
    }

    return (
      <div
        css={[style.btnItem, style.confirm]}
        className="cl-Alert-btn-confirm"
        onClick={confirm}
        onTouchStart={() => undefined}
      >
        {confirmContent}
      </div>
    );
  };

  const showBtn = () => {
    if (!showCancel && !showConfirm) {
      return null;
    }

    return (
      <div css={style.btn} className="cl-Alert-btn">
        {cancelBtn()}
        {confirmBtn()}
      </div>
    );
  };

  return (
    <FixContainer
      {...htmlProps}
      showMask={showMask}
      centerChild={true}
      css={maskAnimation}
    >
      <div
        className="cl-Alert-container"
        css={[style.container, animation]}
        onAnimationEnd={animationEnd}
      >
        {showContent}
        {showBtn()}
      </div>
    </FixContainer>
  );
}
