import React from "react";
import { showDialog } from "../Dialog";
import { Wrapper, WrapperProps } from "./Wrapper";

export interface CascaderProps extends WrapperProps {
  blankClosable: boolean;
  showMask?: boolean;
  maskColor?: string;
}

/**
 * 显示Cascader
 * @param option
 */
export function showCascader(props: CascaderProps) {
  const { blankClosable, showMask, maskColor, onCancel, onConfirm, ...extra } =
    props;
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
export function Cascader(
  props: CascaderProps & { children?: React.ReactNode }
) {
  const { children, ...option } = props;
  return (
    <div
      onClick={() => {
        showCascader(option);
      }}
    >
      {children}
    </div>
  );
}
