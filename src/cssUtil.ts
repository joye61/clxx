import { ObjectInterpolation } from "@emotion/core";
import { is } from "./is";

/**
 * 全局窗口信息
 */
export interface WindowInfo {
  // 窗口实际宽度
  width: number;
  // 窗口实际高度
  height: number;
  // 窗口设计宽度
  designWidth: number;
  // 移动和非移动的临界宽度
  criticalWidth: number;
}

export const win: WindowInfo = {
  width: window.innerWidth,
  height: window.innerHeight,
  designWidth: 375,
  criticalWidth: 576
};

/**
 * 以vw单位做自适应
 * @param num 设计稿显示尺寸
 * @param designWidth 设计稿总宽度
 */
export function vw(num: number) {
  if (win.width <= win.criticalWidth) {
    return `${(num * 100) / win.designWidth}vw`;
  } else {
    return `${(num * win.criticalWidth) / win.designWidth}px`;
  }
}

export function vwWithMediaQuery(
  css: ObjectInterpolation<undefined>,
  cssWithMediaQuery: ObjectInterpolation<undefined> = {},
  criticalWidth: number = 576
) {
  return {
    ...css,
    [`@media (min-width: ${criticalWidth}px)`]: cssWithMediaQuery
  };
}

/**
 * 生成一个自适应页面宽度的尺寸
 * @param designSize 设计稿的元素尺寸
 * @param designWidth 设计稿的总宽度
 * @param criticalWidth 移动端和PC端的临界尺寸
 */
export function px(
  designSize: number,
  designWidth: number = 375,
  criticalWidth: number = 576
) {
  const trueWidth = window.innerWidth;
  const rate = designSize / designWidth;
  if (trueWidth >= criticalWidth) {
    return `${criticalWidth * rate}px`;
  } else {
    return `${trueWidth * rate}px`;
  }
}

export interface DefaultStyleProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

/**
 * 默认的组件样式属性
 * @param props
 */
export function getStyleProps(props: DefaultStyleProps) {
  const className = is.string(props.className) ? props.className : undefined;
  const id = is.string(props.id) ? props.id : undefined;
  const style = is.plainObject(props.style) ? props.style : undefined;
  return { className, id, style };
}
