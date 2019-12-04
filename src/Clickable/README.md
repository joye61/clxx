# 可响应元素

可响应元素提供了一个非常使用的组件和一个基础库，解决了移动端手指点击响应体验问题。基本上相当于实现了 CSS 中的`:active`伪类，但提供了防止点击穿透的功能

## 背景

鼠标点按效果在移动端依赖于 `:active` 伪类的实现，但`:active`存在两个明显的问题：

1. 在`iOS`系统存在兼容问题，需要依赖于检测到 javascript 定义的 touch 事件才能响应
2. 当嵌套的父子元素都有`:active`定义时，存在点击穿透现象，即点击子元素，父元素也会有视觉上的交互响应

## Clickable 组件

<p>
  <img src="../../assets/clickable.gif" width="50%">
</p>


```typescript
// 首先引入组件
import { Clickable } from "cl-utils";

// 组件可接收的属性声明如下
interface ClickableProps {
  /**
   * 是否允许冒泡
   */
  canBubble?: boolean;
  /**
   * 当按钮被点击激活时的样式
   */
  activeStyle?: ObjectInterpolation<any>;
}

// 应用组件
<Clickable
  onClick={() => {
    console.log("确定按钮点击了");
  }}
>
  确定
</Clickable>;

// 应用组件并设置点击样式，点击时文字为红色
<Clickable
  activeStyle={{color: "red"}}
  onClick={() => {
    console.log("点击确定文字变红");
  }}
>
  确定
</Clickable>;


// 组件嵌套，可以防止点击穿透
<Clickable>
  <p>一个嵌套的可点击组件</p>
  <Clickable>内部按钮</Clickable>
</Clickable>

```
