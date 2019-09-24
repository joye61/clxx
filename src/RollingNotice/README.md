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
  // CSS类名
  className?: string;
  // 滚动列表中单项的样式
  itemClass?: string;
  // 滚动列表中单项的样式
  itemStyle?: React.CSSProperties;
  // 滚动公告的高度，必须带CSS长度单位
  height?: string;
  // 列表数据
  list?: Array<E>;
  // 滚动的间隔，默认为3000毫秒，单位为毫秒
  interval?: number;
  // 滚动动画的时长
  easingDuration?: number;
  // 滚动动画函数
  easing?: string;
}
```
