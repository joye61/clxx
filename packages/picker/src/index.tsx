import React from "react";
import { Dialog } from "@clxx/dialog";
import { PickerDialog } from "./PickerDialog";
import pick from "lodash/pick";
import omit from "lodash/omit";

/**
 * 一个可以唤起选择器的Picker对象
 * @param props PickerProps
 */
export function Picker(props: PickerProps) {
  const dialog = [
    "showResult",
    "list",
    "selected",
    "onCancel",
    "onConfirm",
    "confirmText",
    "cancelText"
  ];
  const dialogProps = pick(props, dialog);
  const leftProps = omit(props, dialog);

  const { children, placeholder, ...attributes } = leftProps;

  return (
    <div {...attributes} onClick={() => showPicker(dialogProps)}>
      {children || placeholder}
    </div>
  );
}

/**
 * 以函数的形式唤起选择器
 * @param option PickerDialogProps
 */
export function showPicker(option: PickerDialogProps) {
  const { onCancel, onConfirm, ...extra } = option;
  const dialog = new Dialog(
    (
      <PickerDialog
        {...extra}
        onCancel={() => {
          onCancel?.();
          dialog.close();
        }}
        onConfirm={result => {
          onConfirm?.(result);
          dialog.close();
        }}
      />
    ),
    "pullup"
  );
}
