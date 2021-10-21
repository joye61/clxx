let keyIndex = 0;
let last = Date.now();

/**
 * 生成一个全局唯一的key
 * @returns
 */
export function uniqKey() {
  keyIndex += 1;
  let now = Date.now();
  if (now !== last && keyIndex > 1e9) {
    keyIndex = 0;
  }
  const key = now.toString(36) + keyIndex.toString(36);
  last = now;
  return key;
}
