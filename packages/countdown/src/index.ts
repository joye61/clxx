import raf from "raf";

export interface CountDownOption {
  // 剩余时间，单位为秒
  remainTime: number;
  // 倒计时的时间间隔，单位为秒
  interval: number;
  // 显示格式，只能是这dhis四个代表的组合，大小写不敏感
  format: string;
  // 每次更新时显示
  onUpdate: updateCallback;
  // 计时器结束时触发
  onEnd: () => void;
  // 显示单位格式
  unitMap: {
    d?: string;
    h?: string;
    i?: string;
    s?: string;
  };
  // 是否立即启动raf，可以选择否在随后主动调用startRaf
  startImmediately?: boolean;
}

export type FormatKey = "d" | "h" | "i" | "s";

export type updateResult = {
  key: FormatKey;
  num: number;
  text: string;
  unit: string;
};
export type updateCallback = (current: updateResult[]) => void;

export class CountDowner {
  option: CountDownOption;

  // 默认的格式列表
  // 由于年份和月份天数不固定，年份和月份不进入格式维度
  // d: 天
  // h: 时
  // i: 分
  // s: 秒
  fullFormat: string[] = ["d", "h", "i", "s"];

  // 最终显示的格式化列表
  formatArr: string[] = [];

  // 计时器句柄
  framer: number = 0;

  constructor(option: CountDownOption) {
    const {
      remainTime = 0,
      interval = 1,
      format = "his", // 默认输出时分秒
      unitMap = {
        d: "天",
        h: "时",
        i: "分",
        s: "秒"
      },
      onUpdate = () => {},
      onEnd = () => {},
      startImmediately = true
    } = option;

    // 获取配置对象的默认值
    this.option = {
      remainTime,
      interval,
      format, // 默认输出时分秒
      unitMap,
      onUpdate,
      onEnd,
      startImmediately
    };

    const arr = this.option.format.toLowerCase().split("");
    // 格式化保证了顺序
    for (let key of this.fullFormat) {
      if (arr.includes(key)) {
        this.formatArr.push(key);
      }
    }

    // 默认立即启动定时器
    if (this.option.startImmediately) {
      this.run();
    }
  }

  /**
   * 启动倒计时
   */
  run() {
    let current = Date.now();
    const frame = () => {
      let now = Date.now();
      if (now - current >= this.option.interval * 1000) {
        current = now;
        this.option.remainTime -= this.option.interval;

        // 定时器结束，也就是倒计时结束
        if (this.option.remainTime <= 0) {
          this.option.remainTime = 0;
        }
        // 更新监听器存在
        if (typeof this.option.onUpdate === "function") {
          this.option.onUpdate(this.getCurrentResult());
        }

        // 结束时触发结束事件
        if (
          this.option.remainTime === 0 &&
          typeof this.option.onEnd === "function"
        ) {
          this.destroy();
          this.option.onEnd();
        }
      }
      if (this.option.remainTime > 0) {
        this.framer = raf(frame);
      }
    };
    this.framer = raf(frame);
  }

  // 销毁计时器
  destroy() {
    raf.cancel(this.framer);
  }

  getCurrentResult(): Array<updateResult> {
    let remain = this.option.remainTime;
    let output: number[] = [];
    for (let key of this.formatArr) {
      switch (key) {
        case "d":
          output.push(Math.floor(remain / 86400));
          remain = remain % 86400;
          break;
        case "h":
          output.push(Math.floor(remain / 3600));
          remain = remain % 3600;
          break;
        case "i":
          output.push(Math.floor(remain / 60));
          remain = remain % 60;
          break;
        case "s":
          output.push(remain);
          break;
        default:
          break;
      }
    }

    return output.map((value, index) => {
      const key = this.formatArr[index] as any;
      return {
        key,
        num: value,
        text: this.pre0(value),
        unit: (this.option.unitMap as any)[key]
      };
    });
  }

  /**
   * 当数字不足10时，前置0进行格式化显示
   * @param num 数字
   */
  pre0(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  /**
   * 设置定时器更新回调函数
   * @param callback 更新回调函数
   */
  onUpdate(callback: updateCallback) {
    if (typeof callback === "function") {
      this.option.onUpdate = callback;
    }
  }
}
