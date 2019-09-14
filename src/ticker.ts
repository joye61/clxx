import raf from "raf";

/**
 * TODO：
 * 1、每隔一段时间执行1次，且执行次数可控制，如：
 *    每隔2秒执行1次，最多执行5次
 *    每隔2秒执行1次，无限执行
 *    每隔2秒执行1次，无限执行，直到销毁
 * 2、以requestAnimationFrame频率一直执行，直到主动销毁
 * 3、可以设置延迟时间开始
 */

export type Task = () => void;

export interface TickerOption {
  // 任务或任务列表
  task: Task | Array<Task>;
  // 任务执行间隔
  interval: number;
  // 任务重复次数
  repeat: number;
  // 任务开始执行间隔
  delay: number;
}


export class Ticker {
  tasks: Array<Task> = [];
  frameId: number = 0;
  isRun: boolean = true;

  /**
   * 设置定时器
   * @param {number} interval 单位毫秒
   */
  constructor(interval: number) {
    let useInterval = false;
    if (typeof interval === "number" && interval > 1000 / 60) {
      useInterval = true;
    }

    let exec = () => this.tasks.forEach(item => item());
    let start = Date.now();
    const frame = () => {
      // 停止Ticker
      if (this.isRun === false) {
        return;
      }
      this.frameId = raf(frame);
      if (useInterval) {
        let current = Date.now();
        let diff = current - start;
        if (diff >= interval) {
          exec();
          start = current;
        }
      } else {
        exec();
      }
    };

    this.frameId = raf(frame);
  }

  /**
   * 添加任务
   * @param {Function} task
   */
  add(task: Task) {
    if (typeof task === "function") {
      this.tasks.push(task);
    }
  }

  /**
   * 移除任务
   * @param {Function} task
   */
  remove(task: Task): void {
    if (typeof task === "function") {
      let findIndex = -1;
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i] === task) {
          findIndex = i;
          break;
        }
      }
      if (findIndex >= 0) {
        this.tasks.splice(findIndex, 1);
      }
    }
  }

  destroy() {
    this.isRun = false;
    raf.cancel(this.frameId);
    this.tasks = [];
  }
}
