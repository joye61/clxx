import React from "react";
import { showDialog } from "../Dialog";
import { Wrapper, WrapperProps } from "./Wrapper";
import { omit, pick } from "lodash";

export interface ShowCascaderProps extends WrapperProps {
  blankClosable: boolean;
  showMask?: boolean;
  maskColor?: string;
}

export interface CascaderProps extends ShowCascaderProps, Omit<React.HTMLProps<HTMLDivElement>, "defaultValue" | "onSelect"> {
  children?: React.ReactNode;
}

/**
 * 显示Cascader
 * @param option
 */
export function showCascader(props: ShowCascaderProps) {
  const { blankClosable, showMask, maskColor, onCancel, onConfirm, ...extra } = props;
  const stop = showDialog({
    content: (
      <Wrapper
        {...extra}
        onCancel={() => {
          stop();
          onCancel?.();
        }}
        onConfirm={(values) => {
          stop();
          onConfirm?.(values);
        }}
      />
    ),
    type: "pullUp",
    blankClosable,
    showMask,
    maskColor,
  });
  return stop;
}

/**
 * Cascader组件
 * @param props
 * @returns
 */
export function Cascader(props: CascaderProps) {
  const { children, onClick, ...option } = props;

  const cascaderProps = [
    "blankClosable",
    "showMask",
    "maskColor",
    "options",
    "defaultValue",
    "onSelect",
    "renderCancel",
    "renderConfirm",
    "renderTitle",
    "onConfirm",
    "onCancel",
  ];

  const showPickerOption = pick(option, cascaderProps) as ShowCascaderProps;
  const boxProps = omit(option, cascaderProps) as React.HTMLProps<HTMLDivElement>;

  return (
    <div
      onClick={(event) => {
        onClick?.(event);
        showCascader(showPickerOption);
      }}
      {...boxProps}
    >
      {children}
    </div>
  );
}
