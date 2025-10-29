# CLXX

<p align="center">
  <strong>轻量级 React 移动端组件库</strong>
</p>

<p align="center">
  基于 React 19 + TypeScript + Emotion 构建的现代化移动端 UI 组件库
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/clxx"><img src="https://img.shields.io/npm/v/clxx.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/clxx"><img src="https://img.shields.io/npm/dm/clxx.svg" alt="npm downloads"></a>
  <a href="https://github.com/joye61/clxx/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/clxx.svg" alt="license"></a>
</p>

---

## ✨ 特性

- 🎯 **专为移动端设计** - 完美适配移动端交互和体验
- 📱 **响应式布局** - 基于 rem 的自适应方案，支持多种屏幕尺寸
- 🎨 **CSS-in-JS** - 使用 Emotion 实现样式隔离和动态样式
- 🔧 **TypeScript** - 完整的类型定义，提供更好的开发体验
- ⚡ **高性能** - 优化的渲染逻辑和事件处理
- 🎪 **函数式调用** - Toast、Dialog、Loading 等支持命令式调用
- 🚀 **现代化** - 支持 React 19，使用最新的 Hooks API
- 📦 **轻量级** - 按需加载，tree-shaking 友好

---

## 📦 安装

```bash
# npm
npm install clxx

# yarn
yarn add clxx

# pnpm
pnpm add clxx
```

### Peer Dependencies

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0"
}
```

---

## 🚀 快速开始

### 基础使用

```tsx
import React from 'react';
import { Container, showToast } from 'clxx';

function App() {
  return (
    <Container designWidth={750}>
      <button onClick={() => showToast('Hello CLXX!')}>
        点击显示 Toast
      </button>
    </Container>
  );
}

export default App;
```

### 使用路由创建应用

```tsx
import { createApp } from 'clxx';

createApp({
  target: '#root',
  designWidth: 750,
  routeMethod: 'hash',
  renderPage: async (pathname) => {
    // 动态加载页面组件
    const Page = await import(`./pages${pathname}`);
    return <Page.default />;
  },
});
```

---

## 📚 组件文档

### 🎨 布局组件

#### Container - 容器组件

全局根容器，提供移动端自适应、rem 布局和初始化逻辑。

```tsx
import { Container } from 'clxx';

<Container 
  designWidth={750}      // 设计稿宽度，默认 750
  resizeDelay={100}      // resize 防抖延迟，默认 100ms
  globalStyle={css`...`} // 全局样式
>
  <YourApp />
</Container>
```

**特性**：
- ✅ 自动 rem 适配
- ✅ 处理浏览器字体缩放
- ✅ 防止初始化闪烁
- ✅ 支持自定义全局样式

---

#### Flex 布局

提供快捷的 Flex 布局组件。

```tsx
import { Row, RowCenter, RowBetween, Col, ColCenter } from 'clxx';

// 水平布局
<RowCenter>
  <div>居中对齐</div>
</RowCenter>

<RowBetween>
  <div>两端对齐</div>
</RowBetween>

// 垂直布局
<ColCenter>
  <div>垂直居中</div>
</ColCenter>
```

**可用组件**：
- `Row` / `RowStart` - 水平布局（左对齐）
- `RowCenter` - 水平居中
- `RowEnd` - 水平右对齐
- `RowBetween` - 两端对齐
- `RowAround` - 周围分布
- `RowEvenly` - 均匀分布
- `Col` / `ColStart` / `ColCenter` / `ColEnd` / `ColBetween` / `ColAround` / `ColEvenly` - 对应的垂直布局

---

#### AutoGrid - 自动网格

自动计算并排列网格布局。

```tsx
import { AutoGrid } from 'clxx';

<AutoGrid 
  cols={3}           // 列数
  gap="10px"         // 间距
  isSquare={true}    // 是否正方形
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</AutoGrid>
```

---

#### SafeArea - 安全区域

处理手机刘海屏、底部横条等安全区域。

```tsx
import { SafeArea } from 'clxx';

<SafeArea type="top">顶部安全区域</SafeArea>
<SafeArea type="bottom">底部安全区域</SafeArea>
```

---

### 🎭 交互组件

#### Clickable - 点击态

提供点击反馈效果的容器组件。

```tsx
import { Clickable } from 'clxx';

<Clickable
  activeStyle={{ opacity: 0.6 }}  // 激活样式
  bubble={false}                   // 是否冒泡
  onClick={() => console.log('clicked')}
>
  点击我
</Clickable>
```

---

#### Overlay - 遮罩层

全屏或局部遮罩层组件。

```tsx
import { Overlay } from 'clxx';

<Overlay
  fullScreen={true}            // 是否全屏
  centerContent={true}         // 内容是否居中
  maskColor="rgba(0,0,0,0.6)"  // 遮罩颜色
  outside={true}               // 是否渲染到 body
>
  <div>遮罩内容</div>
</Overlay>
```

---

#### ScrollView - 滚动容器

带触底、触顶检测的滚动容器。

```tsx
import { ScrollView } from 'clxx';

<ScrollView
  height="100vh"
  reachBottomThreshold={50}
  onReachBottom={(e) => {
    console.log('到底了', e);
  }}
  onReachTop={(e) => {
    console.log('到顶了', e);
  }}
>
  <div>滚动内容</div>
</ScrollView>
```

---

### 💬 反馈组件

#### Toast - 轻提示

```tsx
import { showToast, showUniqToast } from 'clxx';

// 基础用法
showToast('操作成功');

// 完整配置
showToast({
  content: '操作成功',
  position: 'middle',  // top | middle | bottom
  duration: 2000,
  offsetTop: 50,
});

// 全局唯一 Toast（新的会替换旧的）
showUniqToast('只显示一个');
```

---

#### Dialog - 对话框

```tsx
import { showDialog } from 'clxx';

const close = showDialog({
  content: <div>对话框内容</div>,
  type: 'center',           // center | pullUp | pullDown | pullLeft | pullRight
  blankClosable: true,      // 点击空白处关闭
  showMask: true,           // 显示遮罩
});

// 手动关闭
close();
```

---

#### Alert - 警告框

```tsx
import { showAlert } from 'clxx';

showAlert({
  title: '提示',
  description: '确定要删除吗？',
  showCancel: true,
  onConfirm: () => console.log('确认'),
  onCancel: () => console.log('取消'),
});
```

---

#### Loading - 加载中

```tsx
import { showLoading, showLoadingAtLeast } from 'clxx';

// 基础用法
const close = showLoading('加载中...');
// 关闭
close();

// 至少显示指定时间（避免闪烁）
const close = showLoadingAtLeast(300, '加载中...');
// 即使立即调用 close()，也会至少显示 300ms
close();
```

---

### 🎪 展示组件

#### Indicator - 加载指示器

```tsx
import { Indicator } from 'clxx';

<Indicator
  size={60}
  barCount={12}
  barColor="#fff"
  duration={600}
/>
```

---

#### Ago - 相对时间

显示相对时间（多久以前）。

```tsx
import { Ago } from 'clxx';

<Ago date={new Date()} />
// 输出：刚刚

<Ago 
  date="2024-01-01"
  renderContent={(value) => `${value.num}${value.unit}前`}
/>
```

---

#### Countdowner - 倒计时

```tsx
import { Countdowner } from 'clxx';

<Countdowner
  remain={3600}        // 剩余秒数
  format="his"         // 格式：d(天) h(时) i(分) s(秒)
  seperator=":"        // 分隔符
  onEnd={() => console.log('倒计时结束')}
/>
```

---

#### CarouselNotice - 滚动公告

```tsx
import { CarouselNotice } from 'clxx';

<CarouselNotice
  list={['公告1', '公告2', '公告3']}
  height="40px"
  interval={3000}
  duration={200}
/>
```

---

## 🛠️ 工具函数

### 网络请求

```tsx
import { GET, POST, sendJSON, jsonp } from 'clxx';

// GET 请求
const data = await GET('/api/users', { page: 1 });

// POST 请求（FormData）
const result = await POST('/api/login', { 
  username: 'admin',
  password: '123456'
});

// 发送 JSON
const result = await sendJSON('/api/data', { data: {...} });

// JSONP 请求
const data = await jsonp('https://api.example.com/data');
```

**高级配置**：
```tsx
import { sendRequest, registerHostAlias } from 'clxx';

// 注册 Host 别名
registerHostAlias({
  api: 'https://api.example.com',
  cdn: 'https://cdn.example.com'
});

// 使用别名
await GET('api@/users');  // 实际请求：https://api.example.com/users

// 完整配置
const result = await sendRequest({
  url: '/api/data',
  method: 'POST',
  sendType: 'json',
  data: { key: 'value' },
  timeout: 5000,
  disableUrlCache: true,
});
```

---

### 时间处理

```tsx
import { ago, calendarTable, Countdown, waitFor, waitUntil } from 'clxx';

// 相对时间
const result = ago('2024-01-01');
console.log(result.format); // "3个月前"

// 日历表格
const table = calendarTable('2024-10', false, true);
// 返回 6x7 的日期数组

// 倒计时器
const countdown = new Countdown({
  remain: 3600,
  format: 'his',
  onUpdate: (value) => console.log(value),
  onEnd: () => console.log('结束'),
});
countdown.start();

// 等待指定时间
await waitFor(1000);

// 等待条件满足
await waitUntil(() => document.querySelector('.loaded'), 5000);
```

---

### 工具类

```tsx
import { 
  tick, 
  uniqKey, 
  defaultScroll,
  createPortalDOM,
  is,
  normalizeUnit,
  adaptive
} from 'clxx';

// 逐帧执行
const stop = tick(() => {
  console.log('每帧执行');
}, 16); // 可选的间隔时间
stop(); // 停止

// 生成唯一 Key
const key = uniqKey(); // "1730123456789_1"

// 禁用/启用滚动
defaultScroll.disable();
defaultScroll.enable();

// 创建 Portal DOM
const portal = createPortalDOM();
portal.mount(<YourComponent />);
portal.unmount();

// 环境判断
if (is('ios')) { /* iOS 设备 */ }
if (is('android')) { /* Android 设备 */ }
if (is('mobile')) { /* 移动设备 */ }
if (is('touchable')) { /* 支持触摸 */ }

// 单位标准化
normalizeUnit(100);        // "100px"
normalizeUnit('50rem');    // "50rem"
normalizeUnit(0.5, '%');   // "0.5%"
```

---

## 🎯 自定义 Hooks

```tsx
import { 
  useInterval, 
  useTick, 
  useUpdate,
  useWindowResize,
  useViewport 
} from 'clxx';

// 定时器 Hook
useInterval(() => {
  console.log('每秒执行');
}, 1000);

// 逐帧执行 Hook
useTick(() => {
  console.log('每帧执行');
});

// 强制更新
const update = useUpdate();
update(); // 触发组件重新渲染

// 窗口大小变化
useWindowResize(() => {
  console.log('窗口大小改变');
}, 100); // 防抖 100ms

// Viewport 设置
useViewport({
  width: 'device-width',
  initialScale: 1,
  userScalable: 'no',
});
```

---

## 🎨 样式工具

```tsx
import { css } from '@emotion/react';
import { adaptive, normalizeUnit, splitValue } from 'clxx';

// 自适应样式（基于 750 设计稿）
const styles = adaptive({
  width: 375,      // 自动转换为 vw + 媒体查询
  height: 200,
  padding: 20,
  fontSize: 28,
});

// 拆分数值和单位
const { num, unit } = splitValue('100px');
console.log(num, unit); // 100, "px"
```

---

## ⚙️ 配置

### 全局配置

```tsx
import { setContextValue } from 'clxx';

// 设置文档宽度范围
setContextValue({
  maxDocWidth: 576,  // 最大宽度
  minDocWidth: 312,  // 最小宽度
});
```

---

## 📱 最佳实践

### 1. 项目入口配置

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Container } from 'clxx';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Container 
    designWidth={750}
    resizeDelay={100}
  >
    <App />
  </Container>
);
```

### 2. 使用路由

```tsx
import { createApp, setContextValue } from 'clxx';

// 配置全局上下文
setContextValue({
  maxDocWidth: 576,
  minDocWidth: 312,
});

// 创建应用
createApp({
  target: '#root',
  designWidth: 750,
  routeMethod: 'hash',
  
  // 加载前
  onBeforeRenderPage: async (pathname) => {
    console.log('准备加载:', pathname);
  },
  
  // 加载中
  onLoadingPage: () => <div>Loading...</div>,
  
  // 渲染页面
  renderPage: async (pathname) => {
    const modules = {
      '/': () => import('./pages/Home'),
      '/about': () => import('./pages/About'),
    };
    
    const loadModule = modules[pathname] || modules['/'];
    const module = await loadModule();
    return <module.default />;
  },
  
  // 加载后
  onAfterRenderPage: (pathname) => {
    document.title = pathname;
  },
});
```

### 3. 性能优化建议

```tsx
// 1. 使用防抖优化 resize
<Container resizeDelay={150} />

// 2. 使用 showUniqToast 避免多个 Toast 堆叠
showUniqToast('只显示最新的');

// 3. Loading 至少显示一定时间避免闪烁
const close = showLoadingAtLeast(300, '加载中...');

// 4. ScrollView 使用合适的阈值
<ScrollView
  reachBottomThreshold={100}
  onReachBottom={loadMore}
/>
```

---

## 🔧 TypeScript 支持

所有组件和函数都提供完整的 TypeScript 类型定义：

```tsx
import type { 
  ContainerProps,
  ToastProps,
  DialogProps,
  OverlayProps,
  // ... 更多类型
} from 'clxx';

// 自定义扩展
import { showToast } from 'clxx';

const myShowToast = (message: string) => {
  showToast({
    content: message,
    duration: 3000,
    position: 'middle',
  });
};
```

---

## 📋 浏览器支持

- iOS Safari 10+
- Android Chrome 5.0+
- 现代浏览器（Chrome, Firefox, Safari, Edge）

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 License

[MIT](./LICENSE)

---

## 🔗 相关链接

- [GitHub](https://github.com/joye61/clxx)
- [NPM](https://www.npmjs.com/package/clxx)
- [Issues](https://github.com/joye61/clxx/issues)

---

## 📝 更新日志

### v2.1.4 (2025-10-28)

#### 🎉 新增
- 新增 `useUpdate`、`useWindowResize`、`useViewport` Hooks 导出
- Container 组件新增 `resizeDelay` 配置项

#### 🐛 Bug 修复
- 修复 Overlay 组件 resize 性能问题
- 修复 Toast 组件定时器清理错误
- 修复 Countdowner 依赖数组缺失
- 修复 SafeArea 类型定义
- 修复字体缩放可能导致的无限循环

#### ⚡ 性能优化
- Overlay 组件添加 resize 防抖
- Container 组件优化初始化逻辑
- useWindowResize 使用现代 API 替代废弃的 orientationchange
- 优化网络请求超时逻辑，使用 AbortController

#### 🔨 代码改进
- 移除不必要的 lodash/round 依赖
- 统一 Hooks 导出风格
- 改进类型定义准确性
- 优化事件监听器使用 passive 选项

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/joye61">Joye</a>
</p>
