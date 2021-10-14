/** @jsx jsx */
import { Interpolation, jsx, Theme } from "@emotion/react";
import { Clickable } from "../Clickable";
import { Row } from "../Flex/Row";
import { style } from "./style";
import * as CSS from "csstype";

export interface AlertWrapperProps {
  // 标题
  title?: React.ReactNode;
  // 内容
  description?: React.ReactNode;
  // 确认按钮
  confirm?: React.ReactNode;
  // 确认按钮颜色
  confirmColor?: CSS.Property.Color;
  // 取消按钮
  cancel?: React.ReactNode;
  // 取消按钮颜色
  cancelColor?: CSS.Property.Color;
  // 显示取消按钮
  showCancel?: boolean;
  // 确认回调
  onConfirm?: () => void;
  // 取消回调
  onCancel?: () => void;
}

export function AlertWrapper(props: AlertWrapperProps) {
  const {
    title = "提示",
    description,
    confirm = "确定",
    confirmColor = "#007afe",
    cancel = "取消",
    cancelColor = "#666",
    showCancel = false,
    onConfirm,
    onCancel,
  } = props;

  // 展示按钮组
  let btnBoxCss: Interpolation<Theme> = [style.btnBox];
  if (showCancel) {
    btnBoxCss.push(style.btnBoxWithCancel);
  }

  return (
    <div css={style.container}>
      <div css={style.content}>
        {/* 标题 */}
        <div css={style.title}>{title}</div>
        {/* 内容 */}
        {description && <div css={style.desc}>{description}</div>}
      </div>
      <Row alignItems="stretch" css={btnBoxCss}>
        {/* 取消按钮 */}
        {showCancel && (
          <Clickable
            css={{ color: cancelColor }}
            onClick={onCancel}
            activeStyle={{
              backgroundColor: `#c0c0c022`,
            }}
          >
            {cancel}
          </Clickable>
        )}
        {/* 确认按钮 */}
        <Clickable
          css={{ color: confirmColor }}
          onClick={onConfirm}
          activeStyle={{
            backgroundColor: `#c0c0c022`,
          }}
        >
          {confirm}
        </Clickable>
      </Row>
    </div>
  );
}
