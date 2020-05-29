/**
 * 环境变量
 */
declare const window: Window & {
  __CLXX_CRITICAL_WIDTH: number;
  __CLXX_DESIGN_WIDTH: number;
};

/**
 * 确保全局的环境变量被正确设置
 */
export function ensureEnvironmentValue() {
  // 当前H5页面的临界宽度
  if (!window.__CLXX_CRITICAL_WIDTH) {
    window.__CLXX_CRITICAL_WIDTH = 576;
  }
  // 当前H5页面的设计宽度
  if (!window.__CLXX_DESIGN_WIDTH) {
    window.__CLXX_DESIGN_WIDTH = 375;
  }
}


// 获取环境变量值
export function getEnv(){
  ensureEnvironmentValue();
  return {
    criticalWidth: window.__CLXX_CRITICAL_WIDTH,
    designWidth: window.__CLXX_DESIGN_WIDTH
  }
}

ensureEnvironmentValue();
