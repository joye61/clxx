declare type Task = () => void;
export default class Ticker {
    tasks: Array<Task>;
    frameId: number;
    isRun: boolean;
    /**
     * 设置定时器
     * @param {number} interval 单位毫秒
     */
    constructor(interval: number);
    /**
     * 添加任务
     * @param {Function} task
     */
    add(task: Task): void;
    /**
     * 移除任务
     * @param {Function} task
     */
    remove(task: Task): void;
    destroy(): void;
}
export {};
