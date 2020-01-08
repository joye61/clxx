import React from "react";
import { Dialog } from "@clxx/dialog";
import { PickerDialog, PickerDialogProps } from "./PickerDialog";
import pick from "lodash/pick";
import omit from "lodash/omit";

export interface PickerProps
  extends PickerDialogProps,
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    > {
  children?: React.ReactNode;
  placeholder?: React.ReactNode & any;
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
        onConfirm={(index: number, value?: any) => {
          onConfirm?.(index, value);
          dialog.close();
        }}
      />
    ),
    "pullup"
  );
}

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
