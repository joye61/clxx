/**
 * tick类，初始化后使用start开始tick，使用destroy终止tick
 * @constructor
 * @param {function} callback start后每一帧都会调用的回调函数
 */
export class Tick {
  frameId: number | undefined = undefined;
  isRun: boolean = true;
  constructor(public callback?: () => void) {}
  start(): void {
    // 每一帧执行的任务
    const frame = () => {
      if (!this.isRun) return;
      // 在回调执行之前预约下一帧
      this.frameId = requestAnimationFrame(frame);
      // 执行回调
      this.callback?.();
    };
    // 执行起始帧
    frame();
  }
  destroy(): void {
    if (typeof this.frameId === "number") {
      cancelAnimationFrame(this.frameId);
    }
    this.isRun = false;
  }
}
