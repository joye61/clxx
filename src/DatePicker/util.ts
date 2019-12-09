import dayjs, { Dayjs, ConfigType } from "dayjs";

/**
 * 给数字添加前缀0，当数字<10时
 * @param numLike
 */
export function prefix0(numLike: number | string) {
  let num: number;
  if (typeof numLike === "number") {
    num = numLike;
  } else {
    num = parseInt(numLike, 10);
  }

  return num < 10 ? `0${num}` : num;
}

/**
 * 判断当前选择器的模式是否正确
 * @param mode
 */
export function modeExist(mode: string) {
  return "ymdhis".indexOf(mode.toLowerCase()) >= 0;
}

/**
 * 根据用户的选择获取最终值
 * 不能在最大最小值之外
 */
export function getFinalValue(changed: ConfigType, min: ConfigType, max: ConfigType) {
  const changeValue = dayjs(changed);
  const minValue = dayjs(min);
  const maxValue = dayjs(max);
  if (changeValue.isBefore(minValue)) {
    return minValue;
  }
  if (changeValue.isAfter(maxValue)) {
    return maxValue;
  }
  return changeValue;
}
