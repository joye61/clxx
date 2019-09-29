import { injectGlobal } from "emotion";
import { is } from "./is";

/**
 * 只适用于移动端的vw自适应
 */
export function vw(num: number): string {
  return `${(100 * num) / 375}vw`;
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

/**
 * 获取1像素的物理宽度
 */
export function ppxWidth(): number {
  return 1 / window.devicePixelRatio;
}

export interface AdaptiveOption {
  // 设计宽度
  designWidth?: number;
  // 移动和非移动端的临界宽度
  criticalWidth?: number;
}

/**
 * 适用于移动端H5页面的预设和自适应方案（非响应式支持）
 * @param option number | AdaptiveOption
 *  number: 代表设置尺寸
 *  AdaptiveOption: 可以传递对象
 */
export function normalizeWithAdaption(option: number | AdaptiveOption) {
  let config: AdaptiveOption = {
    designWidth: 375,
    criticalWidth: 576
  };

  if (is.number(option)) {
    config.designWidth = option;
  } else if (is.plainObject(option)) {
    config = { ...config, ...option };
  }

  return injectGlobal`
    * {
      box-sizing: border-box;
    }
    html {
      -webkit-tap-highlight-color: transparent;
      -webkit-overflow-scrolling: touch;
      -webkit-text-size-adjust: 100%;
      font-size: ${(100 * 100) / (config.designWidth as number)}vw;
    }
    body {
      font-size: initial;
      margin: 0 auto;
      max-width: ${config.criticalWidth}px;
    }
    @media screen and (min-width: ${config.criticalWidth}px) {
      html {
        font-size: ${(100 * (config.criticalWidth as number)) /
          (config.designWidth as number)}px;
      }
    }
  `;
}

/**
 * 采用纯px计算的方式设置根元素rem，兼容性好于normalizeWithAdaption
 * @param option number | AdaptiveOption
 */
export function pureRemAdaption(option: number | AdaptiveOption) {
  let config: AdaptiveOption = {
    designWidth: 375,
    criticalWidth: 576
  };

  if (is.number(option)) {
    config.designWidth = option;
  } else if (is.plainObject(option)) {
    config = { ...config, ...option };
  }

  const resetFontSize = () => {
    const fontSize =
      window.innerWidth <= (config.criticalWidth as number)
        ? `${(window.innerWidth * 100) / (config.designWidth as number)}px`
        : `${((config.criticalWidth as number) * 100) /
            (config.designWidth as number)}px`;

    document.documentElement.style.fontSize = fontSize;
  };

  window.onresize = resetFontSize;
  if (window.onorientationchange !== undefined) {
    window.onorientationchange = resetFontSize;
  }

  // 首次调用执行一次计算
  resetFontSize();
}
