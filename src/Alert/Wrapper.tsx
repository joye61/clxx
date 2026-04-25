import { Interpolation, Theme } from '@emotion/react';
import { Clickable } from '../Clickable';
import { Row } from '../Flex/Row';
import { style } from './style';
import * as CSS from 'csstype';

// 按下态底色：模块级常量，Dialog 可能多次重提交（onConfirm 后重新 render）时避免重复分配
const activeBg: React.CSSProperties = { backgroundColor: 'rgba(0,0,0,.04)' };

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

  // 可定制的样式
  titleStyle?: Interpolation<Theme>;
  descStyle?: Interpolation<Theme>;
  btnStyle?: Interpolation<Theme>;
  confirmStyle?: Interpolation<Theme>;
  cancelStyle?: Interpolation<Theme>;
}

export function AlertWrapper(props: AlertWrapperProps) {
  const {
    title = '提示',
    description,
    confirm = '确定',
    confirmColor = '#007aff',
    cancel = '取消',
    cancelColor = '#3c3c43',
    showCancel = false,
    onConfirm,
    onCancel,

    // 可定制的样式
    titleStyle,
    descStyle,
    btnStyle,
    cancelStyle,
    confirmStyle,
  } = props;

  // 展示按钮组
  const btnBoxCss: Interpolation<Theme> = [
    style.btnBox,
    showCancel ? style.btnBoxWithCancel : null,
  ];

  return (
    <div css={style.container}>
      <div css={style.content}>
        {/* 标题 */}
        <div css={[style.title, titleStyle]}>{title}</div>
        {/* 描述 */}
        {description && <div css={[style.desc, descStyle]}>{description}</div>}
      </div>
      <Row alignItems="stretch" css={btnBoxCss}>
        {/* 取消按钮 */}
        {showCancel && (
          <Clickable
            css={[style.btn, btnStyle, cancelStyle, { color: cancelColor }]}
            onClick={onCancel}
            activeStyle={activeBg}
          >
            {cancel}
          </Clickable>
        )}
        {/* 确认按钮 */}
        <Clickable
          css={[
            style.btn,
            style.btnConfirm,
            btnStyle,
            confirmStyle,
            { color: confirmColor },
          ]}
          onClick={onConfirm}
          activeStyle={activeBg}
        >
          {confirm}
        </Clickable>
      </Row>
    </div>
  );
}
