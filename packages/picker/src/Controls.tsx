/** @jsx jsx */
import { jsx } from "@emotion/core";
import { RowBetween } from "@clxx/layout";
import { style } from "./ControlsStyle";

export interface ControlsProps {
  showResult?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  children?: React.ReactNode;
}

/**
 * Picker通用控制按钮组
 * @param props 
 */
export function Controls(props: ControlsProps) {
  const {
    showResult = true,
    confirmText = "确定",
    cancelText = "取消",
    onCancel,
    onConfirm,
    children
  } = props;

  return (
    <RowBetween css={style.btnGroup}>
      <div
        css={style.btn}
        className="cancel"
        onTouchStart={() => undefined}
        onClick={() => {
          onCancel?.();
        }}
      >
        {cancelText}
      </div>
      <div
        css={style.btn}
        onTouchStart={() => undefined}
        className="confirm"
        onClick={() => {
          onConfirm?.();
        }}
      >
        {confirmText}
      </div>
      {showResult ? <div css={style.result}>{children}</div> : null}
    </RowBetween>
  );
}
