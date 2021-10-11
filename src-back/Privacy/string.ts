/**
 * 将一个输入值限制在一个范围之内，当超出这个范围时，取临界值
 * @param n 输入值
 * @param min 最小边界
 * @param max 最大边界
 */
export function restrictRange(n: number, min: number, max: number) {
  min = Math.min(min, max);
  max = Math.max(min, max);
  let result: number = n;
  if (n < min) {
    result = min;
  } else if (n > max) {
    result = max;
  }
  return result;
}

/**
 * 替换某一个范围的字符串
 * @param input
 * @param placeholder
 * @param from
 * @param to
 */
export function replaceRange(
  input: string,
  placeholder: string = '*',
  from?: number,
  to?: number,
): string {
  // 如果输入不合法，直接返回空
  if (!input || typeof input !== 'string') {
    return '';
  }

  // 规范起点和终点
  from = restrictRange(from ?? 0, 0, input.length - 1);
  to = restrictRange(to ?? input.length - 1, 0, input.length - 1);
  from = Math.min(from, to);
  to = Math.max(from, to);

  // 获取最终输出结果
  const output: Array<string> = [];
  for (let i = 0; i < input.length; i++) {
    if (i < from || i > to) {
      output.push(input[i]);
    } else {
      output.push(placeholder);
    }
  }
  return output.join('');
}

/**
 * 替换一个字符串内容，头部和尾部特定长度的字符串排除在外
 * @param input
 * @param placeholder
 * @param headLength
 * @param tailLength
 */
export function replaceWithoutHeadTail(
  input: string,
  placeholder: string = '*',
  headLength?: number,
  tailLength?: number,
) {
  // 如果输入不合法，直接返回空
  if (!input || typeof input !== 'string') {
    return '';
  }

  // 规范化首尾长度
  headLength = headLength ?? 0;
  tailLength = tailLength ?? 0;

  // 获取最终输出结果
  const output: Array<string> = [];
  for (let i = 0; i < input.length; i++) {
    if (i < headLength || i > input.length - 1 - tailLength) {
      output.push(input[i]);
    } else {
      output.push(placeholder);
    }
  }
  return output.join('');
}
