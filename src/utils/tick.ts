export type StopTick = () => void;

/**
 * 逐帧执行某个回调
 * @param callback 每一帧都会调用的回调
 * @returns
 */
export function tick(callback?: () => void): StopTick {
  let frameId: number | undefined = undefined;
  let isRun: boolean = true;
  // 停止tick
  let stop = () => {
    if (typeof frameId === "number") {
      cancelAnimationFrame(frameId);
    }
    isRun = false;
  };
  // 每一帧执行的任务
  const frame = () => {
    if (!isRun) return;
    // 在回调执行之前预约下一帧
    frameId = requestAnimationFrame(frame);
    // 执行回调
    callback?.();
  };
  // 执行起始帧
  frame();

  return stop;
}
