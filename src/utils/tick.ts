export type StopTick = () => void;

/**
 * 逐帧执行的工具函数，返回一个方法，调用该方法，停止执行
 * @param callback
 * @param interval
 */
export function tick(callback: () => void, interval?: number): StopTick {
  // 执行状态，是否正在执行
  let isRunning: boolean;

  let frame: () => void;
  let frameId: number;

  // 设置了tick的间隔
  if (interval && typeof interval === 'number') {
    let lastTick = Date.now();
    frame = () => {
      if (!isRunning) {
        return;
      }
      frameId = requestAnimationFrame(frame);
      const now = Date.now();

      // 每次间隔频率逻辑上保持一致，即使帧频不一致
      if (now - lastTick >= interval) {
        // 本次tick的时间为上次的时间加上频率间隔
        lastTick = lastTick + interval;
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
      frameId = requestAnimationFrame(frame);
      // 没有设置interval时，每帧都执行
      callback();
    };
  }

  // 开始执行
  isRunning = true;
  frameId = requestAnimationFrame(frame);

  // 返回一个可以立即停止的函数
  return () => {
    isRunning = false;
    cancelAnimationFrame(frameId);
  };
}
