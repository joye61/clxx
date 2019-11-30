import { HeightProperty, WidthProperty } from "csstype";
import { TouchEvent, MouseEvent } from "react";

export type ScrollDirection = "vertical" | "horizontal";

export interface ContainerProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  /**
   * 初始的位移位置，只能有一个值生效，跟方向有关
   */
  offsetX?: number;
  offsetY?: number;
  /**
   * 可滚动内容
   */
  children?: React.ReactNode;
  /**
   * 宽度值一般在水平方向滚动时设置，非强制
   */
  width?: WidthProperty<number>;
  /**
   * 滚动容器高度，要激活容器，必须传递此值
   * 否则容器将永远被内容撑成和内容一样高
   */
  height?: HeightProperty<number>;
  /**
   * 水平还是垂直方向滚动
   */
  direction?: "vertical" | "horizontal";
  /**
   * 反向摩擦力系数，惯性时的减速度系数，这是个很小的值
   * 一般情况下，不建议手动设置，系统默认即可
   */
  friction?: number;
  onReachBottom?: () => void;
}

export interface ScrollBarProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

/**
 * 滚动视图状态
 */
export interface ScrollViewState {
  offsetX: number;
  offsetY: number;
}

/**
 * 容器和内容的尺寸信息
 */
export interface SizeInfo {
  containerWidth: number;
  containerHeight: number;
  contentWidth: number;
  contentHeight: number;
}

/**
 * 事件处理程序集合
 */
export interface EventHandlerMap<E = Element> {
  [key: string]: (evnet: TouchEvent<E> & MouseEvent<E>) => void;
}

export interface MoveData {
  isMove: boolean;
  lastX: number;
  lastY: number;
  currentX: number;
  currentY: number;
  lastMoveTime: number;
}

export interface InertiaData {
  runInertia: boolean;
}
