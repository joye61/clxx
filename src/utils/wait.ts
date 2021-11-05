import { Tick } from "./tick";

/**
 * 直接条件为真或者超时才返回结果
 *
 * @param condition 检测条件
 * @param maxTime 最大等待时长（毫秒）
 *
 * @returns 返回检测的结果，超时返回false
 */
export async function waitUntil(condition: () => boolean | Promise<boolean>, maxTime?: number) {
  // 记录检测开始时间
  const start = Date.now();

  // 如果检测条件不为函数，直接返回结果
  if (typeof condition !== "function") {
    return !!condition;
  }

  // 设置默认检测时间的最大值，如果没有设置，则一直检测
  if (!maxTime || typeof maxTime !== "number") {
    maxTime = Infinity;
  }

  return new Promise<boolean>((resolve) => {
    const tick = new Tick(() => {
      const now = Date.now();
      const result = condition();
      // 超时返回false
      if (now - start >= maxTime!) {
        tick.destroy();
        resolve(false);
        return;
      }
      // 处理结果
      const handle = (res: boolean) => {
        if (res) {
          tick.destroy();
          resolve(true);
        }
      };

      // 未超时状态
      if (result instanceof Promise) {
        result.then(handle);
        return;
      }
      // 普通一般的结果
      handle(result);
    });
    tick.start();
  });
}

/**
 * 等待固定时间，期间一直阻塞
 * @param duration 等待时长(毫秒)
 */
export async function waitFor(duration: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration);
  });
}
