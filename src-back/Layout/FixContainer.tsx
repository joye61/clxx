/** @jsx jsx */
import { Interpolation, jsx, Theme } from '@emotion/react';
import * as CSS from 'csstype';
import { ClxxScreenEnv } from '../utils/cssUtil';

export interface FixContainerProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  /**
   * 是否显示半透明遮罩背景
   */
  showMask?: boolean;
  /**
   * 背景遮罩的颜色值
   */
  maskColor?: string;
  /**
   * 是否让子元素垂直和水平都居中
   */
  centerChild?: boolean;
  /**
   * 容器内容
   */
  children?: React.ReactNode;
  /**
   * 容器最大的寬度，默认为576px
   */
  maxWidth?: CSS.Property.MaxWidth;
  /**
   * 容器深度
   */
  zIndex?: number;
  /**
   * 容器样式，提供额外选项
   */
  containerStyle?: Interpolation<Theme>;
}

/**
 * fix定位的容器元素，一般作为弹框的背景
 * @param props
 */
export function FixContainer(props: FixContainerProps) {
  const {
    showMask = true,
    maskColor = `rgba(0, 0, 0, .4)`,
    centerChild = true,
    maxWidth = `${ClxxScreenEnv.CriticalWidth}px`,
    zIndex = 9999,
    children,
    containerStyle,
    ...attributes
  } = props;

  /**
   * 容器默认样式
   */
  const styles: Interpolation<Theme> = {
    position: 'fixed',
    left: '50%',
    zIndex,
    width: '100%',
    maxWidth,
    transform: `translateX(-50%)`,
    height: '100vh',
    top: 0
  };
  if (showMask) {
    styles.backgroundColor = maskColor;
  }
  if (centerChild) {
    styles.display = 'flex';
    styles.justifyContent = 'center';
    styles.alignItems = 'center';
  }
  return (
    <div css={[styles, containerStyle]} {...attributes}>
      {children}
    </div>
  );
}
