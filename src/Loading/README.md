# Loading 组件


包含2种预设加载效果：

- 菊花齿轮效果 `helix`
- 波浪形态效果 `wave`

<p>
  <img src="../../assets/helix-loading.gif" height="150">
  <img src="../../assets/wave-loading.gif" height="150">
</p>


```javascript
// 新建一个Loading，默认的效果是 wave
const loading = new Loading();
// 销毁上一步创建的Loading
loading.destroy();

// 可以直接传入字符串参数，在动画下方添加一个文字提示
const loading = new Loading("正在加载");

// 可以用一个配置对象参数来创建加载效果
const loading = new Loading({
  type: "wave", // 效果类型
  color: "#fff", // 加载效果元素的颜色
  hint: "正在加载", // 提示文案
});

// 当用配置对象创建加载效果时，提示内容可以是一个React组件
const loading = new Loading({
  type: "wave", // 效果类型
  color: "#fff", // 加载效果元素的颜色
  hint: <p>一个React组件</p>, // 提示文案
});
```