import React from "react";
import { createPortalDOM } from "../utils/dom";
import { DialogType } from "./style";
import { WrapperProps, Wrapper } from "./Wrapper";
import isPlainObject from "lodash/isPlainObject";
import omit from "lodash/omit";

export interface ShowDialogOption extends WrapperProps {
  // 空白处可点击关闭
  maskClosable?: boolean;
  // 弹框内容
  content?: React.ReactNode;
  // 弹窗类型
  type?: DialogType;
}

/**
 * 显示一个对话框，出现和隐藏都带有动画效果
 * @param option
 * @returns
 */
export async function showDialog(option: React.ReactNode | ShowDialogOption) {
  const { mount, destroy } = createPortalDOM();

  // 生成全部配置
  let config: ShowDialogOption = { status: "show", maskClosable: false };
  if (React.isValidElement(option) || !isPlainObject(option)) {
    config.content = option;
  } else {
    config = { ...config, ...(option as ShowDialogOption) };
  }

  // 提取需要单独处理的配置项
  const maskClosable = !!config.maskClosable;
  const children = config.content;
  const onMaskClick = config.onMaskClick;
  const props: WrapperProps = omit(config, ["maskClosable", "content"]);

  // 关闭弹窗
  const closeDialog = () => {
    props.status = "hide";
    props.onHide = destroy;
    mount(<Wrapper {...props}>{children}</Wrapper>);
  };

  // 空白处可点击关闭
  if (maskClosable) {
    props.onMaskClick = () => {
      closeDialog();
      onMaskClick?.();
    };
  }

  // 挂载容器对象
  await mount(<Wrapper {...props}>{children}</Wrapper>);

  // 等待对话框挂载完成才能返回，防止提前调用关闭
  return closeDialog;
}
