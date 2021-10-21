export interface ContextValue {
  // 最大文档尺寸
  maxDocWidth: number;
  // 最小文档尺寸
  minDocWidth: number;
}

let context: ContextValue = {
  maxDocWidth: 576,
  minDocWidth: 312,
};

/**
 * 设置环境变量的值
 * @param envValue
 */
export function setContextValue(value: Partial<ContextValue>) {
  if (typeof context === "object") {
    context = { ...context, ...value };
  }
}

/**
 * 获取环境变量值
 * @param key
 * @returns
 */
export function getContextValue(key?: keyof ContextValue) {
  if (key && typeof key === "string") {
    return context[key];
  }
  return context;
}
