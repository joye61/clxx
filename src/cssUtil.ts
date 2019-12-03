import { is } from "./is";

/**
 * 匹配所有的CSS数值类型的值
 */
export const CSSNumericValueReg = /^((?:\-)?(?:\d+\.?|\.\d+|\d+\.\d+))([a-zA-Z%]*)$/;
/**
 * 匹配所有的CSS跟长度相关的值
 */
export const CSSLenfthUnitReg = /(cap|ch|em|ex|ic|lh|rem|rlh|vh|vw|vi|vb|vmin|vmax|px|cm|mm|Q|in|pc|pt|%)$/;

/**
 * 根据数值获取自适应单位
 *
 * @param num 设计稿尺寸
 * @param overLimit 是否超过临界尺寸
 * @param designWidth 设计稿宽度
 * @param criticalWidth 临界宽度，超过临界宽度失去自适应能力
 */
export function vw(
  num: number,
  overLimit = false,
  designWidth = 375,
  criticalWidth = 576
) {
  if (overLimit) {
    return (criticalWidth * num) / designWidth + "px";
  } else {
    return (num * 100) / designWidth + "vw";
  }
}

/**
 * 标准化长度值单位
 * @param value 长度值
 * @param defaultUnit 默认长度值单位
 */
export function normalizeUnit(value?: number | string, defaultUnit = "px") {
  if (typeof value === "number") {
    return value + defaultUnit;
  }

  if (typeof value === "string") {
    const result = value.match(CSSNumericValueReg);
    if (is.array(result)) {
      return result[2]
        ? parseFloat(value) + result[2]
        : parseFloat(value) + defaultUnit;
    }
  }

  return value;
}

export interface SplitedValue {
  num: number;
  unit: string;
}

export function splitValue(
  value: number | string,
  defaultUnit = "px"
): SplitedValue {
  if (typeof value === "number") {
    return { num: value, unit: defaultUnit };
  }

  if (typeof value === "string") {
    /**
     * 提取数字和单位，以下都是合理的CSS数值
     *
     * 123
     * 123px
     * .98px
     * 98.2px
     * -98rem
     * -0.98rem
     * 98.
     */
    const result = value.match(CSSNumericValueReg);
    if (is.array(result)) {
      return { num: parseFloat(result[1]), unit: result[2] || defaultUnit };
    }
  }

  throw new Error("Invalid numeric format");
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
