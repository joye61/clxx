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
