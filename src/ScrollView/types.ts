import { HeightProperty } from "csstype";
import { TouchEvent, MouseEvent } from "react";

export type ScrollDirection = "vertical" | "";

export interface ContainerProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  /**
   * 可滚动内容
   */
  children?: React.ReactNode;
  /**
   * 滚动容器高度，要激活容器，必须传递此值
   * 否则容器将永远被内容撑成和内容一样高
   */
  height?: HeightProperty<number>;
  /**
   * 水平还是垂直方向滚动
   */
  direction?: "vertical" | "horizontal";
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
}