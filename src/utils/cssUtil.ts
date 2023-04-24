import { Interpolation, Theme, css } from '@emotion/react';
import { ContextValue, getContextValue } from '../context';
/**
 * 匹配所有的CSS数值类型的值
 */
// eslint-disable-next-line no-useless-escape
export const CSSValueReg = /^((?:\-)?(?:\d+\.?|\.\d+|\d+\.\d+))([a-zA-Z%]*)$/;

/**
 * 标准化长度值单位
 * @param value 长度值
 * @param defaultUnit 默认长度值单位
 */
export function normalizeUnit(value?: number | string, defaultUnit = 'px') {
  if (typeof value === 'number') {
    return value + defaultUnit;
  }

  if (typeof value === 'string') {
    const result = value.match(CSSValueReg);
    if (Array.isArray(result)) {
      return result[2]
        ? parseFloat(value) + result[2]
        : parseFloat(value) + defaultUnit;
    }
  }

  return value;
}

/**
 * CSS值的对象表示
 */
export interface SplitedValue {
  num: number;
  unit: string;
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
export function splitValue(
  value: number | string,
  defaultUnit = 'px'
): SplitedValue {
  if (typeof value === 'number') {
    return { num: value, unit: defaultUnit };
  }

  if (typeof value === 'string') {
    const result = value.match(CSSValueReg);
    if (Array.isArray(result)) {
      return { num: parseFloat(result[1]), unit: result[2] || defaultUnit };
    }
  }

  throw new Error('Invalid numeric format');
}

/**
 * 生成自适应的样式，仅供库内部使用
 * 所有内部组件的默认设计尺寸约定为750
 *
 * @param style
 * @returns
 */
export function adaptive(style: Record<string, Interpolation<Theme>>) {
  const ctx = getContextValue() as ContextValue;
  const max: Interpolation<Theme> = {};
  const min: Interpolation<Theme> = {};
  const normal: Interpolation<Theme> = {};
  for (let name in style) {
    let value = style[name];
    if (typeof value !== 'number') {
      normal[name] = value as any;
    } else if (
      [
        'flex',
        'flexGrow',
        'flexShrink',
        'lineHeight',
        'fontWeight',
        'zIndex',
      ].includes(name) &&
      typeof value === 'number'
    ) {
      normal[name] = value as any;
    } else {
      normal[name] = (value * 100) / 750 + 'vw';
      max[name] = (value * ctx.maxDocWidth) / 750 + 'px';
      min[name] = (value * ctx.minDocWidth) / 750 + 'px';
    }
  }
  return css({
    ...normal,
    [`@media (min-width: ${ctx.maxDocWidth}px)`]: max,
    [`@media (max-width: ${ctx.minDocWidth}px)`]: min,
  });
}