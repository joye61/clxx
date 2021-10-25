import { showDialog } from "../Dialog";
import { PickerWrapperProps, Wrapper } from "./Wrapper";
import React from "react";
import pick from "lodash/pick";
import omit from "lodash/omit";

export interface ShowPickerOption extends PickerWrapperProps {
  blankClosable?: boolean;
  showMask?: boolean;
  maskColor?: string;
}

export interface PickerOption
  extends ShowPickerOption,
    Omit<React.HTMLProps<HTMLDivElement>, "defaultValue"> {
  children?: React.ReactNode;
}

/**
 * 显示picker
 * @param option
 */
export function showPicker(option: ShowPickerOption) {
  const { blankClosable, showMask, maskColor, onCancel, onConfirm, ...extra } = option;
  const stop = showDialog({
    content: (
      <Wrapper
        {...extra}
        onCancel={() => {
          stop();
          onCancel?.();
        }}
        onConfirm={(option, index) => {
          stop();
          onConfirm?.(option, index);
        }}
      />
    ),
    type: "pullUp",
    blankClosable,
    showMask,
    maskColor,
  });
}

/**
 * picker组件
 * @param props
 * @returns
 */
export function Picker(props: PickerOption) {
  const { children, onClick, ...option } = props;
  const pickerProps = [
    "blankClosable",
    "showMask",
    "maskColor",
    "options",
    "defaultValue",
    "renderOption",
    "onConfirm",
    "onCancel",
    "renderCancel",
    "renderConfirm",
    "showTitle",
    "renderTitle",
  ];
  const showPickerOption = pick(option, pickerProps) as ShowPickerOption;
  const boxProps = omit(option, pickerProps);
  return (
    <div
      onClick={(event) => {
        onClick?.(event);
        showPicker(showPickerOption);
      }}
      {...boxProps}
    >
      {children}
    </div>
  );
}
