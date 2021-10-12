import React from "react";
import { createPortalDOM } from "../utils/dom";
import { DialogType } from "./style";
import { WrapperProps, Wrapper } from "./Wrapper";
import isPlainObject from "lodash/isPlainObject";
import omit from "lodash/omit";

export interface ShowDialogOption {
  // 空白处可点击关闭
  blankClosable?: boolean;
  // 弹框内容
  content?: React.ReactNode;
  // 弹窗类型
  type?: DialogType;
}

export async function showDialog(option: React.ReactNode | ShowDialogOption) {
  const { mount, destroy } = createPortalDOM();

  // 默认空白不可点击关闭
  let blankClosable = false;
  let children: React.ReactNode;

  // 存储Wrapper的属性
  let props: WrapperProps = { status: "show" };
  if (!isPlainObject(option)) {
    children = option;
  } else {
    const config = option as ShowDialogOption;
    blankClosable = !!config.blankClosable;
    children = config.content;
    props = { ...props, ...omit(config, ["blankClosable", "content"]) };
  }

  // 关闭弹窗
  const closeDialog = () => {
    props.status = "hide";
    mount(<Wrapper {...props}>{children}</Wrapper>);
  };

  if (blankClosable) {
    props.onMaskClick = () => {
      // TODO
    };
  }

  // 挂载容器对象
  await mount(<Wrapper {...props}>{children}</Wrapper>);
}
