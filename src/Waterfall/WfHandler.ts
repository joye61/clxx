type ColInstance = {
  el: HTMLElement;
  height: number;
};

type PushItem<T = React.ReactNode> = T | Promise<T>;

export class WfHandler {
  list: ColInstance[] = [];

  constructor(cols: Array<HTMLElement> = []) {
    cols.forEach(item => {
      this.list.push({
        el: item,
        height: 0
      });
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
  }
}
