# 自适应组件

一个自适应组件，主要适用于移动端。再也不用写一大堆 `javascript` 处理各种奇技淫巧了

- 基于px做自适应基础字体
- 兼容一些边缘逻辑，如系统字体被更改

```ts
// 引入
import { Normalize } from "cl-utils";

// 假设设计稿尺寸为750px
<PageComponent>
  <Normalize designWidth={750}/>
</PageComponent>
```

需要注意的是如果是带多页的应用，每个页面都需要类似`<Normalize designWidth={750}/>`手动引入，因为页面切换时样式也会跟着销毁


组件可接受参数如下：

```ts
interface AdaptiveOption {
  // 设计宽度，默认375
  designWidth?: number;
  // 移动和非移动端的临界宽度，默认576
  criticalWidth?: number;
}
```

在以上示例中，最大的显示区域宽度会`576px`，也就是说在PC端呈现时，会将body在屏幕居中

