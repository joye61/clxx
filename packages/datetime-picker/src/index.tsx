import React from "react";
import { Wrapper } from "./Wrapper";
import { Dialog } from "@clxx/dialog";
import { WrapperProps, DateTimePickerProps } from "./types";
import { Dayjs } from "dayjs";
import pick from "lodash/pick";
import omit from "lodash/omit";

export function DateTimePicker(props: DateTimePickerProps) {
  const wrapper = [
    "date",
    "max",
    "min",
    "mode",
    "onConfirm",
    "confirmText",
    "onChange",
    "showResult",
    "confirmText",
    "cancelText"
  ];
  const wrapperProps = pick(props, wrapper);
  const leftProps = omit(props, wrapper);

  const { children, placeholder, ...attributes } = leftProps;

  return (
    <div {...attributes} onClick={() => showDateTimePicker(wrapperProps)}>
      {children || placeholder}
    </div>
  );
}

/**
 * 函数方式调用
 * @param option 选择器选项
 */
export function showDateTimePicker(option: WrapperProps = {}) {
  const { onCancel, onConfirm, ...wrapperProps } = option;
  const dialog = new Dialog(
    (
      <Wrapper
        {...wrapperProps}
        onCancel={() => {
          onCancel?.();
          dialog.close();
        }}
        onConfirm={(value: Dayjs) => {
          onConfirm?.(value);
          dialog.close();
        }}
      />
    ),
    "pullup"
  );
}
