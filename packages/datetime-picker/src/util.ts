import dayjs, { ConfigType, Dayjs } from "dayjs";

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
export function getFinalValue(changed: Dayjs, min: Dayjs, max: Dayjs) {
  if (changed.isBefore(min)) {
    return min;
  }
  if (changed.isAfter(max)) {
    return max;
  }
  return changed;
}

/**
 * 格式化最终显示结果
 * @param mode 
 * @param value 
 */
export function formatResult(mode: string, value: Dayjs) {
  let result = "";
  if (mode.indexOf("y") >= 0) {
    result += value.year() + "年";
  }
  if (mode.indexOf("m") >= 0) {
    result += prefix0(value.month() + 1) + "月";
  }
  if (mode.indexOf("d") >= 0) {
    result += prefix0(value.date()) + "日";
  }
  if (mode.indexOf("h") >= 0) {
    result += prefix0(value.hour()) + "时";
  }
  if (mode.indexOf("i") >= 0) {
    result += prefix0(value.minute()) + "分";
  }
  if (mode.indexOf("s") >= 0) {
    result += prefix0(value.second()) + "秒";
  }
  return result;
}
