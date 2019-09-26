import { getDomElement, DOMElement } from "../domUtil";
import React from "react";
import ReactDOM from "react-dom";
import { is } from "../is";
import { css as rawCss } from "emotion";

export interface WaterFallOption {
  // 瀑布流绑定的容器
  container: DOMElement;
  // 瀑布流每一列之间的间隔
  gutter?: number | string;
  // 瀑布流一共有多少列
  column?: number;
}

export interface ColumnInfo {}

export class WaterFall {
  queue: Array<React.ReactNode> = [];

  // 瀑布流绑定的容器
  container: Element;
  // 瀑布流显示的容器，生成的
  wfContainer: Element;
  // 通过构造函数传递的参数对象
  config: WaterFallOption;
  // 瀑布流的所有列信息
  columns: ColumnInfo[] = [];

  /**
   * 构造函数参数
   * @param option 
   */
  constructor(option: WaterFallOption | DOMElement) {

    // 获取瀑布流容器和默认配置对象
    let target: DOMElement;
    if (is.plainObject(option)) {
      option = option as WaterFallOption;
      target = option.container;
      this.config = option;
    } else {
      option = option as DOMElement;
      target = option;
      this.config = {
        container: option
      };
    }

    // 如果容器不存在，抛出异常
    this.container = getDomElement(target) as HTMLElement;
    if (!is.element(this.container)) {
      throw new Error(
        `The container that shows the waterfall flow does not exist`
      );
    }

    // 默认两列，适用于移动端
    if(is.undefined(this.config.column)) {
      this.config.column = 2;
    }

    // 默认的间距
    if(is.undefined(this.config.gutter)) {
      this.config.gutter = 15;
    }

    this.wfContainer = document.createElement('div');
    this.wfContainer.classList.add(rawCss({
      display: "flex",
      alignItems: "flex-start",
      paddingLeft: this.config.gutter,
      paddingRight: this.config.gutter,
    }));
    this.container.appendChild(this.wfContainer);

  }

  createLayout(){
    
  }

  push(item: React.ReactNode) {}
}
