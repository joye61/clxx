var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getDomElement } from "../domUtil";
import React from "react";
import ReactDOM from "react-dom";
import { is } from "../is";
import { css as rawCss } from "emotion";
import { px } from "../cssUtil";
export class Waterfall {
    /**
     * 构造函数参数
     * @param option
     */
    constructor(option) {
        this.queue = [];
        // 瀑布流绑定的容器
        this.container = null;
        // 瀑布流的所有列信息
        this.columns = [];
        // 通过构造函数传递的参数对象
        this.config = {
            justify: "around",
            gutter: px(10),
            column: 2
        };
        // 是否正在便利列表
        this.isTraversing = false;
        // 获取瀑布流的配置对象
        if (is.plainObject(option)) {
            this.config = Object.assign(Object.assign({}, this.config), option);
        }
        else {
            this.config.container = option;
        }
        // 如果容器不存在，抛出异常
        this.container = getDomElement(this.config.container);
        if (!is.element(this.container)) {
            throw new Error(`The container that shows the waterfall flow does not exist`);
        }
        // 瀑布流布局需要保证至少有一列，否则无法呈现
        if (this.config.column < 1) {
            this.config.column = 1;
        }
        // 承载列的容器
        this.wfContainer = document.createElement("div");
        const wfCss = {
            display: "flex",
            alignItems: "flex-start"
        };
        if (this.config.justify === "around") {
            wfCss.paddingLeft = this.config.gutter;
            wfCss.paddingRight = this.config.gutter;
        }
        this.wfContainer.classList.add(rawCss(wfCss));
        this.container.appendChild(this.wfContainer);
        // 初始化布局
        this.createLayout();
    }
    /**
     * 创建瀑布流的布局
     */
    createLayout() {
        for (let i = 0; i < this.config.column; i++) {
            const col = document.createElement("div");
            const colCss = {
                flex: 1
            };
            if (i !== this.config.column - 1) {
                colCss.marginRight = this.config.gutter;
            }
            col.classList.add(rawCss(colCss));
            this.wfContainer.appendChild(col);
            this.columns.push(col);
        }
    }
    /**
     * 重点注意：
     * 瀑布流中添加新的项目，这里的参数必须要求是异步返回的
     * 因为进入瀑布流的元素有可能包含还未加载的图片，参数要
     * 求必须在图片加载完成之后才返回组件，以便渲染之后确保
     * 可以将元素插入到正确的列中
     *
     * @param item 一个异步返回的React组件
     */
    push(item) {
        if (!item) {
            return;
        }
        // 保证传入的参数是一个Promise
        if (!(item instanceof Promise)) {
            item = Promise.resolve(item);
        }
        // 创建任务
        const task = () => __awaiter(this, void 0, void 0, function* () {
            // 第一步，等待组件准备好
            const ItemComponent = yield item;
            // 同步代码，选择并找到一个最矮的列插入当前新增元素
            const itemContainer = document.createElement("div");
            let minIndex = 0;
            let minHeight = this.columns[0].getBoundingClientRect().height;
            for (let i = 1; i < this.columns.length; i++) {
                const height = this.columns[i].getBoundingClientRect().height;
                if (height < minHeight) {
                    minIndex = i;
                    minHeight = height;
                }
            }
            this.columns[minIndex].appendChild(itemContainer);
            // 第二步，等待渲染完成
            yield new Promise(resolve => {
                ReactDOM.render(React.createElement(React.Fragment, null, ItemComponent), itemContainer, () => {
                    resolve();
                });
            });
        });
        // 任务必须遵循先后顺序，将任务插入队列
        this.queue.push(task);
        // 异步遍历任务并执行
        if (!this.isTraversing) {
            this.runTask();
        }
    }
    /**
     * 执行任务队列，任务队列也是异步的
     */
    runTask() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isTraversing = true;
            while (this.queue.length !== 0) {
                yield this.queue.shift()();
            }
            this.isTraversing = false;
        });
    }
}
