let UniqKeyIndex = 0;

/**
 * 生成一个全局唯一的key
 * @returns 
 */
export function uniqKey() {
  UniqKeyIndex += 1;
  return Date.now().toString(36) + UniqKeyIndex.toString(36);
}
