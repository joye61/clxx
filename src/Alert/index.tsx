/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { showDialog } from "../Dialog";
import { AlertWrapper, AlertWrapperProps } from "./Wrapper";
import isPlainObject from "lodash/isPlainObject";
import omit from "lodash/omit";

export interface ShowAlertOption extends AlertWrapperProps {
  // 是否显示遮罩，主要是提供一个便捷选项
  showMask?: boolean;
}

/**
 * 显示弹框
 * @param option
 */
export function showAlert(option: React.ReactNode | ShowAlertOption) {
  let config: ShowAlertOption;

  if (React.isValidElement(option) || !isPlainObject(option)) {
    config = {
      title: option,
    };
  } else {
    config = option as ShowAlertOption;
  }

  // 组件选项
  const props: AlertWrapperProps = omit(config, ["showMask"]);
  props.onCancel = async () => {
    await closeDialog();
    config.onCancel?.();
  };
  props.onConfirm = async () => {
    await closeDialog();
    config.onConfirm?.();
  };

  // 创建对话框
  const closeDialog = showDialog({
    showMask: typeof config.showMask === "undefined" ? true : !!config.showMask,
    content: <AlertWrapper {...props} />,
  });

  // 返回关闭逻辑
  return closeDialog;
}
