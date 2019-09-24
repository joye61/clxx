# Toast

<p>
  <img src="../../assets/toast.gif" width="50%">
</p>

这是一个完全参考并扩展自客户端实现的 Toast，提供适度定制：

```typescript
// 引入
import { Toast } from "cl-utils";

// 初始化一个最简单的Toast
Toast.create("抱歉，网络错误");

// 定制Toast
Toast.create({
  onEnd(){
    console.log("toast结束了");
  },
  content: (
    <p>toast的内容可以是复杂的react组件</p>
  ),
  position: "middle",
  duration: 3000
  rounded: true
});
```

参数说明：

- `onEnd`: Toast结束时触发的回调，这里的结束包含过渡动画完成 
- `content`: Toast的内容，可以是任意的`ReactNode`元素
- `position`: `middle`、`top`、`bottom` 任选其一，分别代表显示在屏幕中的位置
- `duration`: Toast在屏幕上的停留时间
- `rounded`: 是否显示圆角的Toast，默认为`true`




需要注意的是Toast是互斥的，同一时间屏幕中不可能存在多个互相叠加的Toast，当连续调用`Toast.create`时，如果前一个Toast没有结束，最后创建的Toast会立即覆盖并完全取代前一个Toast，导致前一个Toast不会触发`onEnd`事件
