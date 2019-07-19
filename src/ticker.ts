import raf from "raf";

type Task = () => void;

export default class Ticker {
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
