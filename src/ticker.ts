import raf from "raf";
import { is } from "./is";

export type Task = () => void;

export class Ticker {
  // 待执行的任务列表
  task: Array<Task> = [];

  // 当前是否处于延迟未执行状态
  inDelay: boolean = true;

  // 延迟或执行定时器的可取消值
  ticker: number = 0;

  /**
   * 单位都为毫秒
   * @param task 可以传递一个或者多个任务
   * @param interval 执行间隔，默认为0，代表以requestAnimationFrame的帧频执行
   * @param repeat 任务重复次数，默认为无限执行
   * @param delay 任务开始执行时的延迟时间，默认立即执行
   */
  constructor(
    task: Task | Array<Task>,
    private interval: number = 0,
    private repeat: number = 0,
    private delay: number = 0
  ) {
    if (is.function(task)) {
      this.task = [task];
    } else if (is.array(task)) {
      this.task = task;
    } else {
      throw new Error("There are no executable tasks");
    }

    if (this.delay > 0) {
      this.ticker = window.setTimeout(() => {
        this.run();
      }, this.delay);
    } else {
      this.run();
    }
  }

  private run() {
    // 只要逻辑进入run，则处于非delay状态
    this.inDelay = false;
    let times = 0;
    let current = Date.now();
    const frame = () => {
      // 超过限制次数停止执行
      if (this.repeat !== 0 && times >= this.repeat) {
        return;
      }

      // 当前帧开始时立即准备下一帧，保证只丢失当前执行超时帧
      this.ticker = raf(frame);

      const now = Date.now();
      if (now - current >= this.interval) {
        times += 1;
        this.task.forEach(task => task());
        current = now;
      }
    };

    // 下一帧开始执行整个流程
    this.ticker = raf(frame);
  }

  add(task: Task) {
    if (is.function(task)) {
      this.task.push(task);
    }
  }

  remove(task: Task) {
    if (is.function(task)) {
      let findIndex = -1;
      for (let i = 0; i < this.task.length; i++) {
        if (this.task[i] === task) {
          findIndex = i;
          break;
        }
      }
      if (findIndex >= 0) {
        this.task.splice(findIndex, 1);
      }
    }
  }

  destroy() {
    if (this.inDelay) {
      window.clearTimeout(this.ticker);
    } else {
      raf.cancel(this.ticker);
    }
  }
}
