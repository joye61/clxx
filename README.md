# 移动端 H5 功能集合

**自研有难度且耗时，缺乏简单易用的第三方**：

- 基于 `React` 和 `React Hooks` 开发
- 基于 [`CSS-IN-JS`](https://github.com/emotion-js/emotion) 技术，零样式文件依赖
- 完全的自适应 UI，易于使用

> 项目采用`^TypeScript V3.9.3`开发


# examples

`examples`目录是一个完全采用`create-react-app`创建的项目，大部分功能都在此项目中实现了demo，请自行clone下来测试

# 安装

```
yarn add clxx
```

或

```
npm install clxx
```

## 引用

```ts
// 导入包
import { showAlert } from "clxx"; 

// 显示弹框
showAlert('最普通的弹框');
```


# 功能列表

<p>✅ <a href="./examples/src/alert">showAlert弹框（替代window.alert）</a></p>
<p>✅ <a href="./examples/src/carouse-notice">CarouseNotice滚动公告</a></p>
<p>✅ <a href="./examples/src/countdown">Countdown倒计时</a></p>
<p>✅ <a href="./examples/src/dialog">Dialog对话框</a></p>
<p>✅ <a href="./examples/src/indicator">Indicator指示器</a></p>
<p>✅ <a href="./examples/src/loading">Loading状态指示</a></p>
<p>✅ <a href="./examples/src/scrollview">ScrollView滚动容器</a></p>
<p>✅ <a href="./examples/src/showToast">showToast轻提示</a></p>
<p>...</p>


# DEMO

<p>
  <img src="assets/demo.gif">
</p>
