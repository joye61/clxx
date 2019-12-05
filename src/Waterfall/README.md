# 瀑布流布局

<p>
  <img src="../../assets/waterfall.gif" width="50%">
</p>

瀑布流布局是一种多列布局方式，常见于信息流列表的呈现！瀑布流布局的特点是可能存在多列，每一列的每个元素高度不一致，当前实现的瀑布流布局具备以下特点：（一个子项就是对应一个UI块）

- 能保证输入的每一个子项的顺序
- 每一项进入瀑布流布局时会选择当前瀑布流中最矮的列进行插入
- 列数可配置

```js
// 第一步、引入瀑布流布局库
import { Waterfall } from "cl-utils";

// 第二步、初始化瀑布流，多种方式
// 参数可以是CSS选择器
const wf = new WfHandler("#container");
// 参数也可以是DOM元素
const container = document.getElementById("container");
const wf = new WfHandler(container);
// 参数也可以是一个配置对象
const wf = new WfHandler(container, {
  gap: "10px", // 空白间距
  cols: 2 // 瀑布流列数
});

// 第三步、向瀑布流中添加UI块，以React元素的形式
wf.push(<div>一个可能很复杂的UI块</div>);
// 添加一个组件
wf.push(<AnyComponent />);
// 添加一个组件
wf.push(
  new Promise(resolve => {
    setTimeout(() => {
      resolve(<AnyComponent />);
    }, 2000);
  })
);
```


# `push` 方法

理解`push`方法是构造瀑布流布局的关键，`push`方法接收一个`Promise`对象参数，**该`Promise`代表一个被传入的元素是否准备好了**，所谓准备好了：就是说只要该参数被插入到瀑布流中能立即计算出对应UI块的高度来

当前实现瀑布流布局的关键在于计算出不同列的高度，取出最矮的那一列，然后将`push`参数对应的元素插入到这一列中。但**实际瀑布流中，几乎所有的实现对应的UI块都包含图片**，而图片的加载是有网络延迟的

基于此，如果一个UI块没有准备好，你应该将其防入一个Promise中，WfHandler会自动等待该Promise完成之后再插入后续元素，从而保证了插入的顺序没有混乱


下面演示一个例子：

```js
// 假设要将一个包含一张网络图片的React元素插入到瀑布流中
const wf = new WfHandler("#container");
// 将组件通过Promise进行包装
wf.push(new Promise(resolve => {
  // 假设图片地址为https://example.com/test.png
  const img = new Image();
  img.src = "https://example.com/test.png";
  im.onload = ()=>{
    // MyComponent对应的DOM包含图片的引用，到这里进行返回
    // 才能保证改UI块被插入到瀑布流中时能立即获取到高度
    resolve(<MyComponent />)
  }
}))
```

注意：如果`push`的参数不是一个`Promise`，会被自动的通过`Promise.resolve(参数)`进行包装

试想如果不这么做，计算的高度就会出错，显示就不能按照正确的输入顺序来了。

> 最佳实践：通过友好的loading提示，提前将所有图片下载下来，然后将包含图片的组件批量插入到瀑布流中，会达到最好的显示效果



