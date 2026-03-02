import { tick } from './tick';

export type CountdownValueIndex = 'd' | 'h' | 'i' | 's';
export type CountdownValue = {
  [key in CountdownValueIndex]?: number;
};
export type UpdateCallback = (value: CountdownValue) => void;

export interface CountdownOption {
  // 倒计时剩余时间
  remain?: number | string;
  // 更新时触发
  onUpdate?: UpdateCallback;
  // 结束时触发
  onEnd?: () => void;
  // 格式dhis
  format?: string;
}

export class Countdown {
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

  // 逐帧tick
  _stopTick?: () => void;
  // 每次更新时都会调用
  _onUpdate?: UpdateCallback;
  // 结束时触发调用
  _onEnd?: () => void;

  constructor(option: CountdownOption) {
    if (typeof option.remain === 'string') {
      const parsed = parseFloat(option.remain);
      if (!isNaN(parsed) && parsed >= 0) {
        this.total = this.remain = Math.floor(parsed);
      }
    } else if (typeof option.remain === 'number' && option.remain >= 0) {
      this.total = this.remain = Math.floor(option.remain);
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
      this._stopTick?.();
      this._onUpdate?.(this.formatValue());
      this._onEnd?.();
      return;
    }

    // 初始化立即触发一次更新
    this._onUpdate?.(this.formatValue());

    // 记录倒计时开启时的时间
    const start = Date.now();

    // 使用 1000ms 间隔，避免每帧都执行（性能优化）
    this._stopTick = tick(() => {
      // 获取倒计时已经持续的时间
      const duration = Math.floor((Date.now() - start) / 1000);
      const currentRemain = this.total - duration;

      // 倒计时结束
      if (currentRemain <= 0) {
        this.remain = 0;
        this._stopTick?.();
        this._onUpdate?.(this.formatValue());
        this._onEnd?.();
        return;
      }

      // 调用更新，这里是防止一秒以内多次反复渲染
      if (currentRemain !== this.remain) {
        this.remain = currentRemain;
        this._onUpdate?.(this.formatValue());
      }
    }, 1000);  // ← 添加 1000ms 间隔
  }

  // 停止倒计时（暂停并保留当前剩余时间，可再次 start 恢复）
  stop() {
    this._stopTick?.();
    this._stopTick = undefined;
    this.total = this.remain;
  }

  /**
   * 格式化每次更新的值
   * 注意：format 的顺序决定了如何分配时间
   * 例如：format='his' 时，72小时会显示为 72:00:00
   *      format='dhis' 时，72小时会显示为 3:0:00:00（3天）
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
