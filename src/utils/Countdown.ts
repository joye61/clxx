import raf from 'raf';

export type CountdownValue = {
  [key in 'd' | 'h' | 'i' | 's']?: number;
};
export type UpdateCallback = (value: CountdownValue) => void;

export interface CountdownOption {
  remain?: number | string;
  onUpdate?: UpdateCallback;
  onEnd?: () => void;
  format?: string;
}

export class Countdown {
  /**
   * 当前Updateer的状态
   * 0：停止状态
   * 1：运行状态
   */
  state: 0 | 1 = 0;

  /**
   * 倒计时的剩余时间，单位为秒
   */
  total = 0;
  remain = 0;

  /**
   * 当前倒计时的格式
   * d：天
   * h：时
   * i：分
   * s：秒
   */
  format = ['d', 'h', 'i', 's'];

  // 每次更新时都会调用
  _onUpdate?: UpdateCallback;
  // 结束时触发调用
  _onEnd?: () => void;

  constructor(option: CountdownOption) {
    if (typeof option.remain === 'number' && option.remain >= 0) {
      this.total = this.remain = option.remain;
    }

    // 倒计时需要展示的时间格式
    if (typeof option.format === 'string') {
      const parts = option.format.split('');
      const output: string[] = [];
      this.format.forEach((item) => {
        if (parts.includes(item)) {
          output.push(item);
        }
      });
      this.format = output;
    } else {
      // 设置默认的倒计时格式
      this.format = ['h', 'i', 's'];
    }

    this._onUpdate = option.onUpdate;
    this._onEnd = option.onEnd;
  }

  onUpdate(callback: UpdateCallback) {
    this._onUpdate = callback;
  }

  onEnd(callback: () => void) {
    this._onEnd = callback;
  }

  start() {
    // 如果倒计时时间不够，直接返回
    if (this.remain <= 0) {
      this._onUpdate?.(this.formatValue());
      this._onEnd?.();
      return;
    }

    // 初始化时立即调用一次更新，显示初始值
    raf(() => {
      this._onUpdate?.(this.formatValue());
    });

    // 记录倒计时开启时的时间
    const start = Date.now();
    const frame = () => {
      // 停止状态，不运行
      if (this.state === 0) {
        return;
      }

      // 获取倒计时已经持续的时间
      const duration = Math.floor((Date.now() - start) / 1000);
      const currentRemain = this.total - duration;

      // 倒计时结束
      if (currentRemain <= 0) {
        this.remain = 0;
        this._onUpdate?.(this.formatValue());
        this._onEnd?.();
        return;
      }

      // 调用更新
      if (currentRemain !== this.remain) {
        this.remain = currentRemain;
        this._onUpdate?.(this.formatValue());
      }

      raf(frame);
    };

    // 启动倒计时
    this.state = 1;
    raf(frame);
  }

  // 停止倒计时
  stop() {
    this.total = this.remain;
    this.state = 0;
  }

  /**
   * 格式化每次更新的值
   * @param remainTime
   */
  formatValue(): CountdownValue {
    let remainTime = this.remain;
    const result: CountdownValue = {};

    this.format.forEach((key) => {
      switch (key) {
        case 'd':
          result.d = Math.floor(remainTime / 86400);
          remainTime = remainTime - result.d * 86400;
          break;
        case 'h':
          result.h = Math.floor(remainTime / 3600);
          remainTime = remainTime - result.h * 3600;
          break;
        case 'i':
          result.i = Math.floor(remainTime / 60);
          remainTime = remainTime - result.i * 60;
          break;
        case 's':
          result.s = remainTime;
          break;
        default:
          break;
      }
    });
    return result;
  }
}
