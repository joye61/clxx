/**
 * 只适用于移动端的vw自适应
 */
export function vw(num: number): string {
  return `${(100 * num) / 375}vw`;
}
