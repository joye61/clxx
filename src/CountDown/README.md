# 倒计时

<p>
  <img src="../../assets/countdown.gif" width="50%">
</p>

倒计时是一种 WEB 页面中常见的根据时间流逝显示当前最新时间的功能，本仓库提供的倒计时基础功能支持定制

## CountDown 类

`CountDown` 是一个基础类，提供倒计时的基础驱动，可以根据需要定制倒计时的相关功能

```typescript
// 引入方式
import { CountDown } from "cl-utils";


// 基本的参数原型
new CountDown({
  // 剩余时间，单位为秒
  remainTime: number;
  // 倒计时的时间间隔，单位为秒
  interval: number;
  // 显示格式，只能是这dhis四个代表的组合，大小写不敏感，默认为his
  format: string;
  // 每次更新时显示
  onUpdate: updateCallback;
  // 计时器结束时触发
  onEnd: () => void;
  // 显示单位格式
  unitMap: {
    d?: string;
    h?: string;
    i?: string;
    s?: string;
  };
  // 是否立即启动，也可以选择否在随后主动调用
  startImmediately?: boolean;
});

```

倒计时的格式最多只能到天，不支持比天大的单位如年、月、周等。一个完整的例子和说明如下：

```typescript
// 完全等价于
new CountDowner({
  // 倒计时剩余时间1000秒
  remainTime: 1000,

  // 倒计时显示的三个数据信息默认为"时分秒"，顺序无关，最多只能到天
  format: "his",

  // 倒计时更新的时间间隔为没一秒更新一次，这也是默认值
  interval: 1,
  // 设置倒计时的数据对应的文本单位，将会在onUpdate中返回并对应
  unitMap: {
    d: "天",
    h: "时",
    i: "分",
    s: "秒"
  },

  // onUpdate回调会在倒计时的每一轮自动被调用一次
  // onUpdate回调也是主要的逻辑书写区域
  onUpdate(res) {
    console.log(res);
  },

  // 倒计时时间到0了会触发onEnd
  onEnd() {
    // 这里可以执行相关的清理功能
  }
});
```

onUpdate 回调的参数如下所示

```javascript
// 回调参数为数组
[
  { key: "d", num: 10, text: "10", unit: "天" },
  { key: "h", num: 1, text: "01", unit: "时" },
  { key: "i", num: 4, text: "04", unit: "分" },
  { key: "s", num: 58, text: "58", unit: "秒" }
];
```

- key：代表当前倒计时数据段的 format key
- num: 倒计时数据段的数字表示
- text: 倒计时数据段的文本表示
- unit: 倒计时数据段的单位

如上例中的当前倒计时剩余时间为：还剩 `10天1小时4分钟58秒`

## CountDown 组件

CountDown 类提供了原生的面向 JavaScript 编程的能力，而`CountDown`是对`CountDowner`的组件化封装，简单易用，推荐在日常开发中以此方式使用：

```typescript
// 引入CountDowner组件
import { CountDown } from "cl-utils";

// 使用方式
<CountDown remainTime={8888}>
```

`CountDown` 接受 `CountDowner` 的所有属性，除此之外，还有一些自定义属性:

```typescript
<CountDown
  {...其他CountDown属性}
  remainTime={8888}
  noUnit={false}
  separator={":"}
  className="container"
  numberStyle={{color: "red"}}
>

```

- `noUnit`： 默认为`true`，当设置此属性为`false`时，默认呈现效果为: `10:09:43`，即中间为冒号分隔
- `separator`：默认为 `:`，当`noUnit`为`true`时，用来分割数据段的字符
- `className`: 倒计时容器的CSS类名
- `numberStyle`: 倒计时数字的样式


