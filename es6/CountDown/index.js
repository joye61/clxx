import { is } from "../is";
import raf from "raf";
export class CountDown {
    constructor(option) {
        this.option = {
            remainTime: 0,
            interval: 1,
            format: "his",
            unitMap: {
                d: "天",
                h: "时",
                i: "分",
                s: "秒"
            },
            onUpdate: () => { },
            onEnd: () => { },
            startImmediately: true
        };
        // 默认的格式列表
        // 由于年份和月份天数不固定，年份和月份不进入格式维度
        // d: 天
        // h: 时
        // i: 分
        // s: 秒
        this.fullFormat = ["d", "h", "i", "s"];
        // 最终显示的格式化列表
        this.formatArr = [];
        // 计时器句柄
        this.framer = 0;
        if (is.number(option)) {
            this.option.remainTime = option;
        }
        else if (is.plainObject(option)) {
            // 防止浅拷贝覆盖默认值
            if (is.plainObject(option.unitMap)) {
                this.option.unitMap = Object.assign(Object.assign({}, this.option.unitMap), option.unitMap);
                delete option.unitMap;
            }
            // 覆盖默认值
            this.option = Object.assign(Object.assign({}, this.option), option);
        }
        else {
            throw new Error("Constructor parameter format error");
        }
        const format = this.option.format.toLowerCase().split("");
        // 格式化保证了顺序
        for (let key of this.fullFormat) {
            if (format.includes(key)) {
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
                if (is.function(this.option.onUpdate)) {
                    this.option.onUpdate(this.getCurrentResult());
                }
                // 结束时触发结束事件
                if (this.option.remainTime === 0 && is.function(this.option.onEnd)) {
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
    getCurrentResult() {
        let remain = this.option.remainTime;
        let output = [];
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
            const key = this.formatArr[index];
            return {
                key,
                num: value,
                text: this.pre0(value),
                unit: this.option.unitMap[key]
            };
        });
    }
    /**
     * 当数字不足10时，前置0进行格式化显示
     * @param num 数字
     */
    pre0(num) {
        return num < 10 ? `0${num}` : `${num}`;
    }
    /**
     * 设置定时器更新回调函数
     * @param callback 更新回调函数
     */
    onUpdate(callback) {
        if (is.function(callback)) {
            this.option.onUpdate = callback;
        }
    }
}
