import { is } from "../is";

export interface CountDownOption {
  // 剩余时间，单位为秒
  remainTime?: number;
  // 倒计时的时间间隔，单位为秒
  interval?: number;
  // 显示格式，只能是这ymdhis六个代表的组合，大小写不敏感
  format?: string;
}

export type updateCallback = () => void;

export class CountDown {
  private option: CountDownOption = {
    remainTime: 0,
    interval: 1,
    format: "his" // 默认输出时分秒
  };

  constructor(option: CountDownOption | number) {
    if (is.number(option)) {
      this.option.remainTime = option;
    } else if (is.plainObject(option)) {
      this.option = { ...this.option, ...(option as CountDownOption) };
    } else {
      throw new Error("Constructor parameter format error");
    }

    this.option.format = (this.option.format as string).toLowerCase();
  }

  onUpdate(callback: updateCallback) {}
}
