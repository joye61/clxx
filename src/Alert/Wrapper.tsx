/** @jsx jsx */
import { jsx, CSSObject } from "@emotion/react";
import React from "react";
import { FlexBox, RowCenter } from "../Layout/Flex";
import { getStyle } from "./style";
import { useEnvChange } from "../effect/useEnvChange";

export interface WrapperOption {
  // 弹框标题
  title?: React.ReactNode;
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

  // 定制容器样式
  containerStyle?: CSSObject;
  // 定制默认标题样式
  titleStyle?: CSSObject;
  // 定制默认内容样式
  contentStyle?: CSSObject;
  // 定制取消按钮样式
  cancelStyle?: CSSObject;
  // 定制确定按钮样式
  confirmStyle?: CSSObject;
}

export function Wrapper(props: WrapperOption) {
  // 检测环境变化
  useEnvChange();

  // 获取样式
  const style = getStyle();

  // 获取配置
  const config: WrapperOption = {
    title: "提示",
    showTitle: false,
    cancel: "取消",
    showCancel: false,
    confirm: "确定",
    ...props
  };

  const cancel = () => {
    config.onCancel?.();
  };
  const confirm = () => {
    config.onConfirm?.();
  };

  // 显示标题
  const showTitle = () => {
    if (config.showTitle) {
      return React.isValidElement(config.title) ? (
        config.title
      ) : (
        <h3 css={[style.title, config.titleStyle]}>{config.title}</h3>
      );
    }
    return undefined;
  };

  // 显示内容
  const showContent = () => {
    if (React.isValidElement(config.content)) {
      return config.content;
    } else {
      return (
        <div css={[style.content, config.contentStyle]}>{config.content}</div>
      );
    }
  };

  // 显示按钮
  const showBtn = (type: "cancel" | "confirm") => {
    if (React.isValidElement(config[type])) {
      return config[type];
    } else {
      return (
        <RowCenter
          css={[
            style.defaultBtn,
            (style as any)[`defaultBtn${type}`],
            // 传入可定制的样式
            (config as any)[`${type}Style`],
          ]}
        >
          {config[type]}
        </RowCenter>
      );
    }
  };

  return (
    <div css={[style.container, config.containerStyle]}>
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
  );
}
