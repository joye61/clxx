import raf from "raf";
import ReactDOM from "react-dom";
import { WfContainer, WfContainerOption } from "./WfContainer";
import React from "react";

type PushItem<T = React.ReactNode> = T | Promise<T>;

export class WfHandler {
  private columns?: Array<HTMLElement>;
  queue: Array<() => Promise<void>> = [];
  isTraversing: boolean = false;

  constructor(
    public container: HTMLElement,
    private option: WfContainerOption = {}
  ) {
    delete this.option.onReady;

    // 初始化先插入瀑布流容器
    ReactDOM.render(
      <WfContainer
        onReady={columns => {
          this.columns = columns;
        }}
        {...this.option}
      />,
      this.container
    );
  }

  /**
   * 确保容器就绪了之后，才可以插入元素
   */
  private async ensureReady() {
    const that = this;
    return new Promise(resolve=>{
      function frame() {
        if (typeof that.columns !== undefined) {
          resolve();
          return;
        }
        raf(frame);
      }
      raf(frame);
    });
  }

  push(item: PushItem<React.ReactNode>) {
    if (!item) {
      return;
    }

    // 保证传入的参数是一个Promise
    if (!(item instanceof Promise)) {
      item = Promise.resolve(item);
    }

    // 创建任务
    const task = async () => {
      // 1、等待瀑布流容器准备好
      if (typeof this.columns === "undefined") {
        await this.ensureReady();
      }

      // 2、等待组件准备好
      const ItemComponent = await item;

      // 3、插入瀑布流元素
      const itemContainer = document.createElement("div");
      let minIndex = 0;
      let minHeight = this.columns![0].getBoundingClientRect().height;
      for (let i = 1; i < this.columns!.length; i++) {
        const height = this.columns![i].getBoundingClientRect().height;
        if (height < minHeight) {
          minIndex = i;
          minHeight = height;
        }
      }
      this.columns![minIndex].appendChild(itemContainer);

      // 4、等待元素渲染完成
      await new Promise(resolve => {
        ReactDOM.render(<>{ItemComponent}</>, itemContainer, () => {
          resolve();
        });
      });
    };

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
  async runTask() {
    this.isTraversing = true;
    while (this.queue.length !== 0) {
      await new Promise(resolve => {
        raf(() => {
          this.queue.shift()!().then(() => resolve());
        });
      });
    }
    this.isTraversing = false;
  }
}
