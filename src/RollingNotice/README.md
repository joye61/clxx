# 滚动公告

<p>
  <img src="../../assets/rolling-notice.gif" width="50%">
</p>

这是一个简单粗暴的可以无限循环的滚动公告React组件：

```js
// 引入
import { RollingNotice } from "cl-utils";

// 使用
<RollingNotice
  className="rn"
  list={[
    "这是第1条滚动测试",
    "这是1条长长长长长长长长长长长长长长长长长长长长长长的测试",
    "这是第3条滚动测试",
    "这是第4条滚动测试"
  ]}
/>;
```

组件所接受的参数如下所示：

```ts
interface RollingNoticeProps<E = string> {
  // 滚动列表
  list?: Array<React.ReactNode>;
  // 滚动容器的高度，每个元素的高度和容器的高度一致
  height?: string | number;
  // 如果时纯文字列表，代表文字的尺寸
  fontSize?: string | number;
  // 每次冒泡等待时长
  duration?: number;
  // 冒泡动画的时长
  bubbleDuration?: number;
}
```
