/** @jsx jsx */
import { jsx, ObjectInterpolation } from '@emotion/core';
import * as CSS from 'csstype';
import { getEnv } from '../utils/global';

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
  maxWidth?: CSS.WidthProperty<any>;
  /**
   * 容器深度
   */
  zIndex?: number;
}

/**
 * fix定位的容器元素，一般作为弹框的背景
 * @param props
 */
export function FixContainer(props: FixContainerProps) {
  const env = getEnv();
  const {
    showMask = true,
    maskColor = `rgba(0, 0, 0, .4)`,
    centerChild = true,
    maxWidth = `${env.criticalWidth}px`,
    zIndex = 9999,
    children,
    ...attributes
  } = props;

  /**
   * 容器默认样式
   */
  const styles: ObjectInterpolation<any> = {
    position: 'fixed',
    left: '50%',
    zIndex,
    width: '100%',
    maxWidth,
    transform: `translateX(-50%)`,
    height: '100vh',
    top: 0,
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
    <div css={styles} {...attributes}>
      {children}
    </div>
  );
}
