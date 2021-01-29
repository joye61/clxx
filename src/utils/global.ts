export type GVARS = {
  // 移动和非移动的临界宽度
  criticalWidth: number;
  // 设计宽度
  designWidth: number;
};

// 扩展window对象
declare const window: Window & {
  __CLXX_VARS: GVARS;
};

// clxx全局环境存储
let clxxVars: GVARS = {
  criticalWidth: 576,
  designWidth: 375,
};

// 环境变化事件
export const ENV_CHANGE_EVENT = "clxx-env-change";

// 发送环境变化事件
export function emitEnvChange(){
  window.dispatchEvent(new CustomEvent(ENV_CHANGE_EVENT, {
    detail: clxxVars
  }));
}

// 监控环境配置变化
Object.defineProperty(window, '__CLXX_VARS', {
  configurable: false,
  get(){
    return clxxVars;
  },
  set(value: Partial<GVARS>){
    clxxVars = {...clxxVars, ...value};
    emitEnvChange();
  }
});

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
