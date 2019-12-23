/** @jsx jsx */
import { jsx } from "@emotion/core";
import { style } from "./PickerDialogStyle";
import { RowBetween } from "@clxx/layout";
import { useState } from "react";
import { ScrollContent } from "./ScrollContent";

export function PickerDialog(props: PickerDialogProps) {
  const {
    list = [],
    selected = 0,
    confirmText = "确定",
    cancelText = "取消",
    showResult = false,
    onConfirm,
    onCancel
  } = props;

  const [current, setCurrent] = useState<number>(selected || 0);

  return (
    <div css={style.container}>
      <RowBetween css={style.btnGroup}>
        <div
          css={style.btn}
          className="cancel"
          onTouchStart={() => {}}
          onClick={() => {
            onCancel?.();
          }}
        >
          {cancelText}
        </div>
        <div
          css={style.btn}
          onTouchStart={() => {}}
          className="confirm"
          onClick={() => {
            onConfirm?.({
              index: current,
              value: list?.[current]
            });
          }}
        >
          {confirmText}
        </div>
        {showResult ? (
          <div css={style.currentValue}>{list?.[current]}</div>
        ) : null}
      </RowBetween>
      <ScrollContent
        list={list}
        selected={selected}
        onChange={index => {
          setCurrent(index);
        }}
      />
    </div>
  );
}
