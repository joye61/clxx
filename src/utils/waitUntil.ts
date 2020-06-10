import raf from 'raf';

/**
 * 检测某一个条件是否成立，任一条件满足即返回
 * 1、检测结果为真，或JS判断为真
 * 2、超时时间到了
 *
 * @param condition 检测条件
 * @param maxTime 最大等待时间，超过时间，无论如何都返回
 *
 * @returns 返回检测的结果
 */
export async function waitUntil(condition: () => boolean, maxTime?: number) {
  // 记录检测开始时间
  const checkStart = Date.now();

  // 如果检测条件不为函数，直接返回结果
  if (typeof condition !== 'function') {
    return !!condition;
  }

  // 设置默认检测时间的最大值
  if (!maxTime || typeof maxTime !== 'number') {
    maxTime = Infinity;
  }

  return new Promise((resolve) => {
    const check = () => {
      const now = Date.now();
      // 获取检测结果
      const result = condition();
      // 检测结果为真或超时，都返回
      if (now - checkStart >= maxTime! || result) {
        resolve(result);
        return;
      }
      raf(check);
    };
    // 开始检测
    raf(check);
  });
}
