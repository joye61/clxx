# 弹幕效果

一个**从右边向左边飘过**的效果实现。只需要两步，就可以轻松实现弹幕舞台效果：

1. 绑定一个可以飘过弹幕的 DOM 容器，创建一个新的弹幕实例
2. 通过弹幕实例添加弹幕

## 使用

<p>
  <img src="../../assets/bullet-screen.gif" width="50%">
</p>

> 效果图由于是 gif，会感觉卡顿，实测效果没有卡顿

```javascript
// 引入弹幕类
import { BulletScreen } from "cl-utils";

// 创建弹幕舞台实例
const bs = new BulletScreen("#bs");

// 向弹幕舞台中添加多条弹幕
bs.push("一条神奇的弹幕");
bs.push("两条神奇的弹幕", 5300);
bs.push("三条神奇的弹幕", 6300);
bs.push("四条神奇的弹幕", 5000);
bs.push("五条神奇的弹幕", 7000);
```

- 创建弹幕舞台实例时，可以直接传递 DOM 元素

  ```javascript
  // 跟上面等价
  const container = document.getElementById("bs");
  const bs = new BulletScreen(container);
  ```

- 弹幕的动画区域会被限制在舞台的矩形区域中，上例就是 `#bs` 代表的 DOM 矩形区域中
- `push`方法的第一个参数可以是任意的`ReactNode`元素，如：

  ```javascript
  bs.push(<p>这是一个React元素</p>);
  ```

- `push`方法可以传递第二个参数，代表弹幕飘过舞台持续的时间，单位为**毫秒**，默认为`5000ms`
