/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { Dialog, DialogOption } from "../Dialog";
import { is } from "../utils/is";
import { WrapperOption } from "./Wrapper";
import { Wrapper } from "./Wrapper";

export interface AlertOption extends WrapperOption {
  // Dialog弹框的配置
  dialogOption?: DialogOption;
}

export function showAlert(option: React.ReactNode | AlertOption) {
  // 获取输入参数
  let inputOption: AlertOption;
  if (React.isValidElement(option) || !is.isPlainObject(option)) {
    inputOption = {
      content: option,
    };
  } else {
    inputOption = option as AlertOption;
  }

  let { dialogOption, onConfirm, onCancel, ...wrapperOption } = inputOption;
  if (!dialogOption) {
    dialogOption = {};
  }
  dialogOption.content = (
    <Wrapper
      onConfirm={() => {
        dialog.close();
        onConfirm?.();
      }}
      onCancel={() => {
        dialog.close();
        onCancel?.();
      }}
      {...wrapperOption}
    />
  );

  // 生成对话框
  const dialog = new Dialog(dialogOption);

  return dialog;
}
