import raf from 'raf';

export interface TickReturn {
  (): void;
}

/**
 * 逐帧执行的工具函数，返回一个方法，调用该方法，停止执行
 * @param callback
 * @param interval
 */
export function tick(callback: () => void, interval?: number): TickReturn {
  // 执行状态，是否正在执行
  let isRunning: boolean;

  let frame: () => void;

  // 设置了tick的间隔
  if (typeof interval === 'number') {
    let lastTick = Date.now();
    frame = () => {
      if (!isRunning) {
        return;
      }
      raf(frame);
      const now = Date.now();
      if (now - lastTick >= interval) {
        lastTick = now;
        callback();
      }
    };
  }
  // 没有设置tick的间隔
  else {
    frame = () => {
      if (!isRunning) {
        return;
      }
      raf(frame);
      callback();
    };
  }

  // 开始执行
  isRunning = true;
  raf(frame);

  // 返回一个可以立即停止的函数
  return () => (isRunning = false);
}
