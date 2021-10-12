export interface ContextValue {
  // 设计稿尺寸
  designWidth: number;
  // 最大屏幕尺寸
  maxScreenWidth: number;
  // 最小屏幕尺寸
  minScreenWidth: number;
}

let context: ContextValue = {
  designWidth: 750,
  maxScreenWidth: 576,
  minScreenWidth: 312,
};

/**
 * 设置环境变量的值
 * @param envValue
 */
export function setContextValue(value: ContextValue) {
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
