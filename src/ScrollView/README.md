# 防穿透滚动

<p>
  <img src="../../assets/scroll.gif" width="50%">
</p>

这是一个主要针对移动端的、非常实用的自定义滚动库，具备以下特性：

1. 防止移动端滚动穿透
2. 极高的性能和流畅度
3. 支持自定义滚动条
4. PC 端兼容
5. 支持嵌套滚动
6. 支持触底、触顶、滚动事件

**注：滚动的先决条件是：滚动内容的高度必须大于包含容器的高度，否则滚动将没有任何效果**，任何情况下没有出现预想中的滚动，请先检查是不是满足此条件

## ScrollBinder 类

`ScrollBinder` 是原生的 JS 实现，可以初始化 ScrollBinder 实例，实现一个滚动容器。

```typescript
// 引入
import { ScrollBinder } from "cl-utils";

// 直接以CSS选择器字符串作为构造函数参数
new ScrollBinder("#target");

// 以DOM元素作为构造函数参数
const target = document.getElementById("target");
new ScrollBinder(target);

// 以复杂对象作为构造函数参数
new ScrollBinder({
  target: "#target",
  showScrollBar: true
});
```

上述示例中，target 为滚动对象的容器，实现要求 target 容器有且仅有一个子元素，作为可滚动内容，如：

```typescript
// 正确的DOM结构
<div id="target">
  <div>
    <!--这里是内容-->
  </div>
</div>

// 错误的DOM结构，容器子元素不唯一
<div id="target">
  <div>
    <!--这里是内容-->
  </div>
  <p></p>
</div>
```

当构造函数的参数传递对象时，该参数的原始类型定义如下：

```typescript
// 滚动容器目标，可以是：
// 1、CSS选择器字符串
// 2、DOM元素
type ScrollTarget = string | HTMLElement | null;

// 构造函数参数类型
interface ScrollBinderOption {
  // 滚动容器目标
  target: ScrollTarget;
  // 当前滚动位置，滚动内容的初始化位置
  initPosition: number;
  // 滚动到底部时触发
  onReachBottom: () => void;
  // 滚动到顶部时触发
  onReachTop: () => void;
  // 滚动到顶部时触发事件的阈值，默认是30px
  reachTopThresHold: number;
  // 滚动到底部时触发事件的阈值，默认是30px
  reachBottomThresHold: number;
  // 是否显示滚动条
  showScrollBar: boolean;
  // 滚动条宽度
  barWidth: number;
  // 自动隐藏滚动条
  barAutoHide: boolean;
  // 滚动条自动隐藏延迟
  barHideDelay: number;
  // 滚动条自动隐藏持续时间
  barShowOrHideDuration: number;
  // 是否显示圆角滚动条
  barRounded: boolean;
  // 自定义滚动条样式
  barStyle: CSSProperties;
  // 惯性滚动时速度衰减系数0<factor<1，不能为0和1
  // 最好不要修改默认值，会影响流畅度
  speedFactor: number;
  // 滚动时触发
  onScroll: () => void;
}
```

## ScrollView 组件

`ScrollView`组件是基于`ScrollBinder`封装的 React 组件，是使用防穿透滚动功能时最推荐使用的方式：

```javascript
import { ScrollView } from "cl-utils";

<ScrollView className="scroll-view" showScrollBar={true}>
  {/**内容可以任意**/}
</ScrollView>
```

`ScrollView` 组件的属性除了继承 `ScrollBinder` 所有的参数之外，还支持一些HTML属性参数：

```ts
interface ScrollViewProps extends ScrollBinderOption {
  children?: React.ReactNode;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}
```
