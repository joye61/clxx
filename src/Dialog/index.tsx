import React from "react";
import { createPortalDOM } from "../utils/dom";
import { DialogType } from "./style";
import { WrapperProps, Wrapper } from "./Wrapper";
import isPlainObject from "lodash/isPlainObject";
import omit from "lodash/omit";

export interface ShowDialogOption extends WrapperProps {
  // 空白处可点击关闭
  blankClosable?: boolean;
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
export function showDialog(option: React.ReactNode | ShowDialogOption) {
  const { mount, destroy } = createPortalDOM();

  // 生成全部配置
  let config: ShowDialogOption = { status: "show", blankClosable: false };
  if (React.isValidElement(option) || !isPlainObject(option)) {
    config.content = option;
  } else {
    config = { ...config, ...(option as ShowDialogOption) };
  }

  // 提取需要单独处理的配置项
  const blankClosable = !!config.blankClosable;
  const children = config.content;
  const onBlankClick = config.onBlankClick;
  const onHide = config.onHide;
  const props: WrapperProps = omit(config, ["blankClosable", "content", "onHide"]);

  // 关闭弹窗
  const closeDialog = async () => {
    props.status = "hide";
    props.onHide = () => {
      destroy();
      onHide?.();
    };
    await mount(<Wrapper {...props}>{children}</Wrapper>);
  };

  // 空白处可点击关闭
  if (blankClosable) {
    props.onBlankClick = async (event) => {
      await closeDialog();
      onBlankClick?.(event);
    };
  }

  // 挂载容器对象
  const amountShow = mount(<Wrapper {...props}>{children}</Wrapper>);

  return async () => {
    // 关闭前确保容器已经被挂载
    await amountShow;
    await closeDialog();
  };
}
