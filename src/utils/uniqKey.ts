let keyIndex = 0;
let lastTimestamp = 0;

/**
 * 生成一个全局唯一的key
 * @returns
 */
export function uniqKey() {
  const now = Date.now();
  // 时间戳变化时重置计数器
  if (now !== lastTimestamp) {
    keyIndex = 0;
    lastTimestamp = now;
  }
  keyIndex += 1;
  return now.toString(36) + keyIndex.toString(36);
}
