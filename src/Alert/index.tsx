/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { Dialog } from "../Dialog";
import { FlexBox, RowCenter } from "../Layout/Flex";
import { getStyle } from "./style";
import { is } from "../utils/is";

export interface AlertOption
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  // 弹框标题
  title?: React.ReactNode & any;
  // 是否显示弹框标题
  showTitle?: boolean;
  // 内容
  content?: React.ReactNode;
  // 取消按钮
  cancel?: React.ReactNode;
  // 是否显示取消按钮
  showCancel?: boolean;
  // 取消按钮被点击时触发
  onCancel?: () => void;
  // 确定按钮
  confirm?: React.ReactNode;
  // 确定按钮被点击时触发
  onConfirm?: () => void;
}

export function showAlert(option: React.ReactNode | AlertOption) {
  // 获取样式
  const style = getStyle();

  // 获取输入参数
  let inputOption: AlertOption;
  if (React.isValidElement(option) || !is.isPlainObject(option)) {
    inputOption = {
      content: option,
    };
  } else {
    inputOption = option as AlertOption;
  }

  // 获取配置
  const config: AlertOption = {
    title: "提示",
    showTitle: false,
    cancel: "取消",
    showCancel: false,
    confirm: "确定",
    ...inputOption,
  };

  const cancel = () => {
		dialog.close();
		config.onCancel?.();
  };
  const confirm = () => {
		dialog.close();
		config.onConfirm?.();
  };

  const showTitle = () => {
    if (config.showTitle) {
      return React.isValidElement(config.title) ? (
        config.title
      ) : (
        <h3 css={style.title}>{config.title}</h3>
      );
    }
    return undefined;
  };

  const showContent = () => {
    if (React.isValidElement(config.content)) {
      return config.content;
    } else {
      return <div css={style.content}>{config.content}</div>;
    }
  };

  const showBtn = (type: "cancel" | "confirm") => {
    if (React.isValidElement(config[type])) {
      return config[type];
    } else {
      return (
        <RowCenter
          css={[style.defaultBtn, (style as any)[`defaultBtn${type}`]]}
        >
          {config[type]}
        </RowCenter>
      );
    }
  };

  const dialog = new Dialog({
    content: (
      <div css={style.container}>
        {showTitle()}
        <div>{showContent()}</div>
        <FlexBox alignItems="stretch" css={style.btn}>
          {/* cancel有显示条件 */}
          {config.showCancel && (
            <div onClick={cancel} css={style.btnCancel}>
              {showBtn("cancel")}
            </div>
          )}
          <div onClick={confirm}>{showBtn("confirm")}</div>
        </FlexBox>
      </div>
    ),
  });
}
