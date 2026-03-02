export type StopTick = () => void;

/**
 * 逐帧执行的工具函数，返回一个方法，调用该方法，停止执行
 * @param callback
 * @param interval
 */
export function tick(callback: () => void, interval?: number): StopTick {
  let isRunning: boolean;
  let frame: () => void;
  let frameId: number;

  // 有效的正整数间隔才走间隔分支
  if (typeof interval === 'number' && interval > 0) {
    let lastTick = Date.now();
    frame = () => {
      if (!isRunning) return;
      frameId = requestAnimationFrame(frame);
      const now = Date.now();

      if (now - lastTick >= interval) {
        // 直接对齐到当前时间，避免长时间后台切回后的追赶风暴
        lastTick = now;
        callback();
      }
    };
  } else {
    // 没有设置 interval 或 interval <= 0 时，每帧执行
    frame = () => {
      if (!isRunning) return;
      frameId = requestAnimationFrame(frame);
      callback();
    };
  }

  isRunning = true;
  frameId = requestAnimationFrame(frame);

  return () => {
    isRunning = false;
    cancelAnimationFrame(frameId);
  };
}
