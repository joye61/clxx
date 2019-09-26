# 点赞效果

<p>
  <img src="../../assets/likeit.gif" width="50%">
</p>

这是一个特效函数，用户可以通过调用`Likeit`函数让目标 DOM 头顶出现一个冒泡后消失的效果，常用于**点赞、+1**之类的特效展示

```javascript
// 引入点赞函数
import { Likeit } from "cl-utils";

// 直接点赞，默认会出现一个“红心”效果
Likeit("#target");

// 设置点赞效果的内容为字符串+1
Likeit("#target", "+1");

// 第一个参数也可以是DOM元素
const target = document.getElementById("target");
Likeit(target);

// 点赞效果的内容可以是任意ReactNode元素
Likeit(
  "#target",
  <div>
    <p>任意的</p>
  </div>
);
```

# 参数说明

点赞函数比较简单，接收 `3` 个参数，具体作用如下签名所示：

```ts
Likeit(
  target: string | HTMLElement, // 点赞的目标
  effect?: React.ReactNode, // 点赞的效果元素内容，即冒泡的视觉元素内容
  onEnd?: () => {}, // 效果结束时可以传递回调（包含动画过程）
): void;
```

点赞函数最大的特点在于第二个参数 `effect` 可以是任意复杂的`ReactNode`元素，基于此可以随意定制点赞效果的UI

当`effect` 参数可以判定为`false`时（`null`, `undefined` ...），默认的点赞效果是一个红心，这是一个svg图像
