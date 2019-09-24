# 可响应元素

可响应元素提供了一个非常使用的组件和一个基础库，解决了移动端手指点击响应体验问题。基本上相当于实现了 CSS 中的`:active`伪类，但提供了防止点击穿透的功能

## 背景

鼠标点按效果在移动端依赖于 `:active` 伪类的实现，但`:active`存在两个明显的问题：

1. 在`iOS`系统存在兼容问题，需要依赖于检测到 javascript 定义的 touch 事件才能响应
2. 当嵌套的父子元素都有`:active`定义时，存在点击穿透现象，即点击子元素，父元素也会有视觉上的交互响应

## Activable

创建一个 DOM 元素的绑定，当点击该元素时，显示特定的视觉交互效果。最简单使用方式如下

```typescript
// 引入类
import { Activable } from "cl-utils";
// 假设页面中存在id为target的DOM元素
new Activable("#target");
```

上述例子是最简单的使用场景，在没有任何交互样式定制的情况下，`target` 元素在点击时会变成半透明状态。

Activable 类的构造函数也可以接受对象参数进行高级定制：

```typescript
// 新建一个可响应实例
const ac = new Activable({
  // 相当于上述参数target，可以时css选择器，也可以时DOM元素
  target: Target;
  // 点击时可以添加一个class类到元素上。可选
  activeClass?: string;
  // 点击时应用到元素上的样式。可选
  activeStyle?: React.CSSProperties;
  // 是否允许点击穿透，默认不能。可选
  bubblable?: boolean;
  // 点击时的事件回调
  onClick?: () => void;
});

// 销毁相关的绑定
ac.destroy();
```

## Clickable 组件

<p>
  <img src="../../assets/clickable.gif" width="50%">
</p>

`Clickable` 组件是一个对 `Activable` 的组件化包装，以上gif是一个用`Clickable`防点击穿透的基本演示，使用方法：

```typescript
// 首先引入组件
import { Clickable } from "cl-utils";

// 组件可接收的属性声明如下
interface ClickableProps {
  // target参数
  className?: string;
  id?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;

  // Activable可接收参数
  activeStyle?: React.CSSProperties;
  activeClass?: string;
  onClick?: () => void;
  bubblable?: boolean;
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
