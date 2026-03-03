export interface ContextValue {
  [key: string]: any;
}

let context: ContextValue = {};

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
export function getContextValue(key?: string) {
  if (key && typeof key === "string") {
    return context[key];
  }
  return context;
}
