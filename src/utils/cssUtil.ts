import { clxxGetEnv } from './global';

/**
 * CSS值的对象表示
 */
interface SplitedValue {
  num: number;
  unit: string;
}

/**
 * CSS值的形式
 */
export type CSSValue = number | string;

/**
 * 匹配所有的CSS数值类型的值
 */
// eslint-disable-next-line no-useless-escape
export const CSSNumericValueReg = /^((?:\-)?(?:\d+\.?|\.\d+|\d+\.\d+))([a-zA-Z%]*)$/;

/**
 * 根据数值获取自适应单位，以vw作为自适应
 * 约定cl组件库的自有组件假定设计尺寸375px
 *
 * @param num 设计稿尺寸
 * @param overLimit 是否超过临界尺寸
 */
export function vw(num: number, overLimit = false) {
  const env = clxxGetEnv();
  if (overLimit) {
    return (env.criticalWidth * num) / 375 + 'px';
  } else {
    return (num * 100) / 375 + 'vw';
  }
}

/**
 * 标准化长度值单位
 * @param value 长度值
 * @param defaultUnit 默认长度值单位
 */
export function normalizeUnit(value?: CSSValue, defaultUnit = 'px') {
  if (typeof value === 'number') {
    return value + defaultUnit;
  }

  if (typeof value === 'string') {
    const result = value.match(CSSNumericValueReg);
    if (Array.isArray(result)) {
      return result[2]
        ? parseFloat(value) + result[2]
        : parseFloat(value) + defaultUnit;
    }
  }

  return value;
}

/**
 *
 * 提取数字和单位，以下都是合理的CSS数值
 *
 * 123
 * 123px
 * .98px
 * 98.2px
 * -98rem
 * -0.98rem
 * 98.
 *
 * @param value
 * @param defaultUnit
 */
export function splitValue(value: CSSValue, defaultUnit = 'px'): SplitedValue {
  if (typeof value === 'number') {
    return { num: value, unit: defaultUnit };
  }

  if (typeof value === 'string') {
    const result = value.match(CSSNumericValueReg);
    if (Array.isArray(result)) {
      return { num: parseFloat(result[1]), unit: result[2] || defaultUnit };
    }
  }

  throw new Error('Invalid numeric format');
}
