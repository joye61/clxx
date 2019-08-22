// 文档根节点元素
const doc: HTMLElement = document.documentElement;

// 当前是否正在绑定
let isAttach: boolean = false;
// 是否正在触摸
let isTouch: boolean = false;
// 点击的目标数组
let targetList: Array<HTMLElement> = [];

/**
 * 获取一个或者多个满足条件的DOM元素
 * @param element HTMLELment
 * @return Array<HTMLElement>
 */
function getTargetList(element: HTMLElement | null): Array<HTMLElement> {
  // 递归退出条件
  if (element === doc || element === null) {
    return [];
  }

  // 将获取到的DOM节点置于数组中
  const list: Array<HTMLElement> = [];
  if (element.dataset.hover !== undefined) {
    list.push(element);
    // 如果不允许点击穿透，查找过程停止
    if (element.dataset.bubbling === undefined) {
      return list;
    }
  }

  // 如果允许穿透，或者没有找到，继续向上寻找
  list.push(...getTargetList(element.parentElement));
  return list;
}

// 触摸开启时
function touchstart(event: TouchEvent) {
  if (!isTouch) {
    if (event.touches.length > 1) {
      return;
    }
    targetList = getTargetList(event.touches[0].target as any);
    targetList.forEach(element => {
      element.classList.add(element.dataset.hover as string);
    });
    isTouch = true;
  }
}

// 触摸结束
function touchend(event: TouchEvent) {
  if (isTouch) {
    targetList.forEach(element => {
      element.classList.remove(element.dataset.hover as string);
    });
    targetList = [];
    isTouch = false;
  }
}

export type HoverOption = {
  allowBubbling?: boolean;
  defaultHoverClass?: string;
};

export interface Hover {
  attach: (option: HoverOption) => void;
  detach: () => void;
}

export const touchHover: Hover = {
  attach() {
    // 绑定全局事件监听
    if (isAttach === false) {
      doc.addEventListener("touchstart", touchstart);
      doc.addEventListener("touchend", touchend);
      doc.addEventListener("touchcancel", touchend);
      isAttach = true;
    }
  },

  detach() {
    if (isAttach === true) {
      doc.removeEventListener("touchstart", touchstart);
      doc.removeEventListener("touchend", touchend);
      doc.removeEventListener("touchcancel", touchend);
      isAttach = false;
    }
  }
};
