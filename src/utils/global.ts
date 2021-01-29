/**
 * 全局环境变量
 */
export type GVARS = {
  // 移动和非移动的临界宽度
  criticalWidth: number;
  // 设计宽度
  designWidth: number;
};

/**
 * 环境变量
 */
declare const window: Window & {
  __CLXX_VARS: GVARS;
};

window.__CLXX_VARS = {
  criticalWidth: 576,
  designWidth: 375,
};

// 获取环境变量值
export function clxxGetEnv() {
  return window.__CLXX_VARS;
}

/**
 * 初始化环境变量
 * @param option
 */
export function clxxSetEnv(option?: Partial<GVARS>) {
  if (!option) return;
  window.__CLXX_VARS = { ...window.__CLXX_VARS, ...option };
}
