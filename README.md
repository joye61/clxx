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

- 🎯 **专为移动端设计** — 完美适配移动端交互和体验
- 📱 **响应式布局** — 基于 rem 的自适应方案，自动处理浏览器字体缩放
- 🎨 **CSS-in-JS** — 使用 Emotion 实现样式隔离和动态样式
- 🔧 **TypeScript** — 完整的类型定义，提供更好的开发体验
- 🎪 **函数式调用** — Toast、Dialog、Loading、Alert 等支持命令式调用
- 🚀 **现代化** — 基于 React 19，使用最新的 Hooks API
- 📦 **轻量级** — tree-shaking 友好，按需引入

---

## 📦 安装

```bash
npm install clxx
# or
yarn add clxx
# or
pnpm add clxx
```

### Peer Dependencies

```json
{
  "react": "^19.2.4",
  "react-dom": "^19.2.4"
}
```

### Dependencies

- `@emotion/react` — CSS-in-JS 样式方案
- `dayjs` — 日期处理
- `history` — 路由历史管理
- `lodash` — 工具函数

---

## 🚀 快速开始

### 基础使用

```tsx
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
```

### 使用路由创建应用

```tsx
import { createApp } from 'clxx';

createApp({
  target: '#root',
  designWidth: 750,
  mode: 'hash',
  default: '/index',
  loading: () => <div>加载中...</div>,
  render: async (pathname) => {
    const Page = await import(`./pages/${pathname}`);
    return <Page.default />;
  },
  notFound: (pathname) => <div>页面不存在: {pathname}</div>,
});
```

---

## 📚 组件文档

### 🏗️ 布局组件

#### Container — 自适应容器

全局根容器，提供移动端 rem 自适应布局、viewport 设置和初始化逻辑。

```tsx
import { Container } from 'clxx';

<Container
  designWidth={750}           // 设计稿宽度，默认 750
  globalStyle={css`...`}      // 全局自定义样式（Emotion Interpolation）
>
  <YourApp />
</Container>
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `designWidth` | `number` | `750` | 设计稿宽度 |
| `globalStyle` | `Interpolation<Theme>` | — | 全局附加样式 |
| `children` | `ReactNode` | — | 子元素 |

**核心能力：**
- 自动计算并设置 `html` 根字体大小，实现 rem 适配
- 检测浏览器字体缩放并自动修正，避免布局偏差
- 通过 `useLayoutEffect` 在绘制前完成修正，防止闪烁
- `useViewport` 自动设置 viewport meta
- 激活 iOS 上的 `:active` 伪类
- 全局设置 `box-sizing: border-box`

---

#### Flex / FlexItem — Flex 布局

提供灵活的 Flex 容器和子元素组件，支持所有标准 CSS Flex 属性。

```tsx
import { Flex, FlexItem } from 'clxx';

<Flex justifyContent="center" alignItems="center">
  <FlexItem flex={1}>自适应宽度</FlexItem>
  <FlexItem flexBasis="100px">固定宽度</FlexItem>
</Flex>
```

**Flex Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `alignItems` | `CSS.Property.AlignItems` | `'center'` | 交叉轴对齐 |
| `justifyContent` | `CSS.Property.JustifyContent` | — | 主轴对齐 |
| `flexDirection` | `CSS.Property.FlexDirection` | — | 主轴方向 |
| `flexWrap` | `CSS.Property.FlexWrap` | — | 换行方式 |
| `flexFlow` | `CSS.Property.FlexFlow` | — | direction + wrap 简写 |
| `alignContent` | `CSS.Property.AlignContent` | — | 多行内容对齐 |

**FlexItem Props：**

| 属性 | 类型 | 说明 |
|------|------|------|
| `flex` | `CSS.Property.BoxFlex` | flex 简写 |
| `flexGrow` | `CSS.Property.FlexGrow` | 放大比例 |
| `flexShrink` | `CSS.Property.FlexShrink` | 缩小比例 |
| `flexBasis` | `CSS.Property.FlexBasis` | 基准大小 |
| `alignSelf` | `CSS.Property.AlignSelf` | 自身对齐 |
| `order` | `CSS.Property.Order` | 排列顺序 |

---

#### Row / Col — 快捷 Flex 布局

基于 `Flex` 封装的水平/垂直快捷布局组件，预设 `flexDirection` 和 `justifyContent`。

```tsx
import { RowCenter, RowBetween, ColCenter } from 'clxx';

<RowCenter>居中对齐</RowCenter>
<RowBetween>
  <span>左侧</span>
  <span>右侧</span>
</RowBetween>
<ColCenter>垂直居中</ColCenter>
```

**水平布局：**
| 组件 | justifyContent |
|------|---------------|
| `Row` / `RowStart` | `flex-start` |
| `RowCenter` | `center` |
| `RowEnd` | `flex-end` |
| `RowBetween` | `space-between` |
| `RowAround` | `space-around` |
| `RowEvenly` | `space-evenly` |

**垂直布局：**
| 组件 | justifyContent |
|------|---------------|
| `Col` / `ColStart` | `flex-start` |
| `ColCenter` | `center` |
| `ColEnd` | `flex-end` |
| `ColBetween` | `space-between` |
| `ColAround` | `space-around` |
| `ColEvenly` | `space-evenly` |

> 所有 Row/Col 组件均支持 `FlexProps` 的全部属性，可覆盖默认预设。

---

#### AutoGrid — 自动网格

自动将子元素排列为网格布局，支持正方形模式。

```tsx
import { AutoGrid } from 'clxx';

<AutoGrid cols={3} gap="10px" isSquare>
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
</AutoGrid>
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `cols` | `number` | `1` | 列数（最小 1） |
| `gap` | `CSS.Property.Width` | `0` | 表格间距 |
| `isSquare` | `boolean` | `false` | 是否强制正方形 |
| `containerStyle` | `Interpolation<Theme>` | — | 容器样式 |
| `itemStyle` | `Interpolation<Theme>` | — | 每个子元素容器样式 |

**特性：**
- 自动补齐最后一行空位（隐藏占位符），保证列宽一致
- 正方形模式通过 `padding-bottom: 100%` 实现

---

#### Fixed — 固定定位

简化 `position: fixed` 的使用，快速将元素固定到页面四边。

```tsx
import { Fixed } from 'clxx';

<Fixed position="bottom">底部固定栏</Fixed>
<Fixed position="top">顶部固定栏</Fixed>
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | 固定位置 |

---

#### SafeArea — 安全区域

处理 iPhone 刘海屏、底部手势条等安全区域。自动设置 `viewport-fit=cover`。

```tsx
import { SafeArea } from 'clxx';

<SafeArea type="top" />    {/* 顶部安全区域 */}
<div>页面内容</div>
<SafeArea type="bottom" /> {/* 底部安全区域 */}
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `type` | `'top' \| 'bottom'` | `'bottom'` | 安全区域位置 |

---

### 🎭 交互组件

#### Clickable — 点击态

提供触摸/点击反馈效果的容器组件，兼容移动端触摸和 PC 鼠标事件。

```tsx
import { Clickable } from 'clxx';

<Clickable activeStyle={{ opacity: 0.5 }} onClick={() => console.log('clicked')}>
  点我
</Clickable>

<Clickable activeClassName="pressed" moveThreshold={20}>
  自定义激活类名
</Clickable>
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `activeStyle` | `React.CSSProperties` | `{ opacity: 0.6 }` | 激活时的样式 |
| `activeClassName` | `string` | — | 激活时追加的类名 |
| `bubble` | `boolean` | `true` | 是否允许事件冒泡 |
| `disable` | `boolean` | `false` | 是否禁用点击态 |
| `moveThreshold` | `number` | `10` | touchmove 取消 active 的位移阈值（px） |

**特性：**
- 自动检测运行环境，触屏设备使用 touch 事件，PC 使用 mouse 事件
- touchmove 超出阈值自动取消激活态
- PC 端在 `document` 上监听 `mouseup`，处理鼠标移出元素后释放的场景
- 未设置 `activeClassName` 和 `activeStyle` 时，默认使用 `opacity: 0.6`

---

#### Overlay — 覆盖层

通用遮罩层组件，可作为弹窗、对话框等的底层容器。

```tsx
import { Overlay } from 'clxx';

<Overlay fullScreen maskColor="rgba(0,0,0,.6)" centerContent>
  <div>居中内容</div>
</Overlay>

<Overlay outside>
  通过 Portal 挂载到 body
</Overlay>
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `fullScreen` | `boolean` | `true` | 是否全屏覆盖 |
| `maskColor` | `string` | `'rgba(0,0,0,.6)'` | 遮罩背景色 |
| `centerContent` | `boolean` | `true` | 内容是否居中 |
| `outside` | `boolean` | `false` | 是否通过 Portal 挂载到 body |

---

#### ScrollView — 滚动视图

功能丰富的滚动容器，支持触顶/触底事件、滚动节流和自动 loading 显示。

```tsx
import { ScrollView } from 'clxx';

<ScrollView
  height="100vh"
  reachBottomThreshold={100}
  onReachBottom={(event) => {
    console.log('触底加载', event.scrollTop);
  }}
  onScroll={(event) => {
    console.log('滚动方向:', event.direction);
  }}
>
  {/* 列表内容 */}
</ScrollView>
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `height` | `CSS.Property.Height` | `'100%'` | 容器高度 |
| `reachTopThreshold` | `number` | `50` | 触顶事件阈值（px） |
| `onReachTop` | `(event: ScrollEvent) => void` | — | 触顶回调 |
| `reachBottomThreshold` | `number` | `50` | 触底事件阈值（px） |
| `onReachBottom` | `(event: ScrollEvent) => void` | — | 触底回调 |
| `onScroll` | `(event: ScrollEvent) => void` | — | 滚动事件回调 |
| `scrollThrottle` | `number` | `16` | 滚动节流时间（ms），约 60fps |
| `showLoading` | `boolean` | `true` | 是否显示底部 loading |
| `loadingContent` | `ReactNode` | — | 自定义 loading 内容 |
| `containerStyle` | `SerializedStyles` | — | 容器样式 |
| `wrapperStyle` | `SerializedStyles` | — | 内容包裹样式 |

**ScrollEvent：**

```typescript
interface ScrollEvent {
  containerHeight: number;   // 容器可视高度
  contentHeight: number;     // 内容总高度
  scrollTop: number;         // 当前滚动位置
  maxScroll: number;         // 最大可滚动距离
  direction: 'upward' | 'downward';  // 滚动方向
  rawEvent?: React.UIEvent;  // 原始事件
}
```

**特性：**
- 使用 `ResizeObserver` 自动检测内容变化和滚动条状态
- 内置 leading + trailing 节流策略
- 触顶/触底事件防重复触发
- 有滚动条时自动显示底部 loading

---

#### CarouselNotice — 轮播公告

垂直滚动的循环轮播公告组件，常用于消息通知、跑马灯等场景。

```tsx
import { CarouselNotice } from 'clxx';

<CarouselNotice
  list={['公告一：xxx', '公告二：xxx', '公告三：xxx']}
  width="100%"
  height="40px"
  interval={3000}
  duration={200}
/>
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `list` | `ReactNode[]` | `[]` | 轮播内容列表 |
| `width` | `CSS.Property.Width` | — | 容器宽度 |
| `height` | `CSS.Property.Height` | — | 容器高度 |
| `justify` | `'start' \| 'center' \| 'end'` | `'center'` | 内容水平对齐方式 |
| `interval` | `number` | `3000` | 切换间隔时间（ms） |
| `duration` | `number` | `200` | 每次冒泡动画持续时间（ms） |
| `containerStyle` | `Interpolation<Theme>` | — | 容器样式 |
| `wrapperStyle` | `Interpolation<Theme>` | — | 内部容器样式 |
| `itemStyle` | `Interpolation<Theme>` | — | 条目样式 |

---

### 🔔 反馈组件

#### showToast / showUniqToast — 轻提示

函数式调用的全局轻提示，支持自定义位置、持续时间和内容。

```tsx
import { showToast, showUniqToast } from 'clxx';

// 简单用法：传入字符串或 ReactNode
showToast('操作成功');
showToast(<MyCustomContent />);

// 高级用法：传入配置对象
showToast({
  content: '提示内容',
  position: 'top',       // 'top' | 'middle' | 'bottom'
  duration: 3000,        // 持续时间，默认 2000ms
  radius: 16,            // 圆角，默认 16
  offsetTop: 50,         // top 位置偏移
  offsetBottom: 50,      // bottom 位置偏移
  containerStyle: css`...`,
  contentStyle: css`...`,
});

// 唯一 Toast（新调用会自动关闭上一个）
showUniqToast('只显示最新的一条');
```

---

#### showDialog — 对话框

函数式调用的模态对话框，支持多种弹出动画，返回关闭函数。

```tsx
import { showDialog } from 'clxx';

// 简单用法
const close = showDialog(<div>对话框内容</div>);
// 调用 close() 关闭

// 高级用法
const close = showDialog({
  content: <div>自定义内容</div>,
  type: 'center',           // 'center' | 'pullUp' | 'pullDown' | 'pullLeft' | 'pullRight'
  blankClosable: true,      // 点击空白区域关闭
  showMask: true,           // 显示遮罩
  maskColor: 'rgba(0,0,0,.6)',  // 遮罩颜色
  boxStyle: css`...`,       // 对话框容器样式
  maskStyle: css`...`,      // 遮罩样式
  onHide: () => {},         // 关闭动画结束后回调
  onBlankClick: () => {},   // 空白处点击回调
});

// 手动关闭（带关闭动画）
await close();
```

**动画类型：**
| type | 效果 |
|------|------|
| `center` | 居中缩放弹出 |
| `pullUp` | 从底部上滑 |
| `pullDown` | 从顶部下滑 |
| `pullLeft` | 从右侧左滑 |
| `pullRight` | 从左侧右滑 |

---

#### showAlert — 弹窗提示

基于 `showDialog` 封装的标准提示弹窗，支持确认/取消按钮。

```tsx
import { showAlert } from 'clxx';

// 简单用法
showAlert('确认要删除吗？');

// 高级用法
const close = showAlert({
  title: '删除确认',
  description: '删除后不可恢复',
  confirm: '确定',
  confirmColor: '#ff4d4d',
  cancel: '取消',
  cancelColor: '#999',
  showCancel: true,
  showMask: true,
  onConfirm: () => {
    console.log('点击了确认');
  },
  onCancel: () => {
    console.log('点击了取消');
  },
  // 可定制样式
  titleStyle: css`...`,
  descStyle: css`...`,
  btnStyle: css`...`,
  confirmStyle: css`...`,
  cancelStyle: css`...`,
});
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `ReactNode` | `'提示'` | 标题 |
| `description` | `ReactNode` | — | 描述内容 |
| `confirm` | `ReactNode` | `'确定'` | 确认按钮文字 |
| `confirmColor` | `string` | `'#007afe'` | 确认按钮颜色 |
| `cancel` | `ReactNode` | `'取消'` | 取消按钮文字 |
| `cancelColor` | `string` | `'#666'` | 取消按钮颜色 |
| `showCancel` | `boolean` | `false` | 是否显示取消按钮 |
| `showMask` | `boolean` | `true` | 是否显示遮罩 |
| `onConfirm` | `() => void` | — | 确认回调 |
| `onCancel` | `() => void` | — | 取消回调 |

---

#### showLoading / showLoadingAtLeast — 加载指示器

函数式调用的全局 Loading，返回关闭函数。

```tsx
import { showLoading, showLoadingAtLeast } from 'clxx';

// 基础用法
const close = showLoading('加载中...');
// 异步操作完成后关闭
await fetchData();
await close();

// 保证最少显示时间（避免闪烁）
const close = showLoadingAtLeast(500, '处理中...');
await fetchData(); // 即使请求很快完成，也会至少显示 500ms
await close();

// 高级用法
const close = showLoading('加载中...', {
  overlay: { maskColor: 'rgba(0,0,0,.3)' },  // 自定义遮罩
  indicator: { barCount: 14, barColor: '#fff' },  // 自定义指示器
  containerStyle: css`...`,
});
```

---

### 📊 展示组件

#### Indicator — 加载指示器

基于 SVG 实现的旋转加载指示器，高度可定制。

```tsx
import { Indicator } from 'clxx';

<Indicator />
<Indicator size={80} barColor="#007afe" barCount={10} duration={800} />
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `size` | `CSS.Property.Width \| number` | `'.6rem'` | 容器尺寸 |
| `barWidth` | `number` | `7` | bar 宽度（SVG 坐标） |
| `barHeight` | `number` | `28` | bar 高度（SVG 坐标） |
| `barColor` | `string` | `'#fff'` | bar 颜色 |
| `barCount` | `number` | `12` | bar 数量 |
| `rounded` | `boolean` | `true` | bar 是否圆角 |
| `duration` | `number` | `600` | 一圈旋转时间（ms） |
| `containerStyle` | `Interpolation<Theme>` | — | 容器样式 |

---

#### Countdowner — 倒计时

倒计时展示组件，支持自定义格式、样式和渲染方式。

```tsx
import { Countdowner } from 'clxx';

// 基础用法（倒计时 60 秒）
<Countdowner remain={60} />

// 自定义格式和样式
<Countdowner
  remain={86400}
  format="dhis"
  separator=":"
  numberStyle={css`color: red; font-weight: bold;`}
  separatorStyle={css`color: #999; margin: 0 4px;`}
  onEnd={() => console.log('倒计时结束')}
/>

// 完全自定义渲染
<Countdowner
  remain={3600}
  format="his"
  renderNumber={(value, key) => (
    <span className="number-box">{value < 10 ? `0${value}` : value}</span>
  )}
  renderSeparator={(value, key) => <span>:</span>}
/>
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `remain` | `number \| string` | `0` | 剩余时间（秒） |
| `format` | `string` | `'his'` | 显示格式：`d`天`h`时`i`分`s`秒 |
| `separator` | `ReactNode` | `':'` | 数字间分隔符 |
| `onUpdate` | `(value: CountdownValue) => void` | — | 每秒更新回调 |
| `onEnd` | `() => void` | — | 倒计时结束回调 |
| `numberStyle` | `Interpolation<Theme>` | — | 数字样式 |
| `separatorStyle` | `Interpolation<Theme>` | — | 分隔符样式 |
| `containerStyle` | `Interpolation<Theme>` | — | 容器样式 |
| `renderNumber` | `(value, key) => ReactNode` | — | 自定义数字渲染 |
| `renderSeparator` | `(value, key) => ReactNode` | — | 自定义分隔符渲染 |

---

#### Ago — 相对时间

将日期格式化为相对时间展示（如 "3分钟前"、"2天后"）。

```tsx
import { Ago } from 'clxx';

<Ago date="2025-01-01" />                      // "x个月前"
<Ago date={new Date()} />                      // "刚刚"
<Ago date="2028-01-01" />                      // "x年后"
<Ago block />                                   // 渲染为 <div>
<Ago date={someDate} renderContent={(result) => (
  <span>{result.num}{result.unit === 'h' ? '小时' : '...'}</span>
)} />
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `date` | `dayjs.ConfigType` | `dayjs()` | 要格式化的日期 |
| `block` | `boolean` | `false` | 是否渲染为 `<div>`，默认 `<span>` |
| `renderContent` | `(result: AgoValue) => ReactNode` | — | 自定义渲染函数 |

**AgoValue：**

```typescript
interface AgoValue {
  num: number;                            // 数字值
  unit: 'y' | 'm' | 'd' | 'h' | 'i' | 's';  // 单位
  format: string;                         // 格式化中文字符串，如 "3天前"
}
```

---

## 🪝 Hooks

#### useWindowResize

监听窗口尺寸变化（包括屏幕旋转），回调通过 ref 保持最新引用。

```tsx
import { useWindowResize } from 'clxx';

useWindowResize(() => {
  console.log('窗口大小变化:', window.innerWidth);
});
```

---

#### useViewport

自动设置或更新 `<meta name="viewport">` 标签。

```tsx
import { useViewport } from 'clxx';

useViewport();  // 使用默认值
useViewport({
  width: 'device-width',
  initialScale: 1,
  userScalable: 'no',
  viewportFit: 'cover',
});
```

---

#### useInterval

安全的 `setInterval` Hook，通过 ref 保持回调最新，`delay` 为 `null` 时暂停。

```tsx
import { useInterval } from 'clxx';

useInterval(() => {
  setCount(c => c + 1);
}, 1000);

// 传入 null 暂停
useInterval(callback, isRunning ? 1000 : null);
```

---

#### useTick

基于 `requestAnimationFrame` 的逐帧执行 Hook，适用于动画或高频更新场景。

```tsx
import { useTick } from 'clxx';

useTick(() => {
  // 每帧执行
  updateAnimation();
});
```

---

#### useUpdate

返回一个强制组件重新渲染的函数。

```tsx
import { useUpdate } from 'clxx';

const forceUpdate = useUpdate();
// 需要时调用
forceUpdate();
```

---

## 🛠️ 工具函数

#### createApp — 创建路由应用

创建一个带路由的单页应用，支持 browser / hash / memory 三种路由模式。

```tsx
import { createApp, history, getHistory } from 'clxx';

await createApp({
  target: '#root',            // 挂载目标元素
  mode: 'hash',               // 路由模式：'browser' | 'hash' | 'memory'
  default: '/index',          // 默认路由路径
  designWidth: 750,           // 设计稿宽度
  globalStyle: css`...`,      // 全局样式
  loading: (pathname) => <Loading />,            // 加载占位
  render: async (pathname) => <PageComponent />, // 页面渲染
  notFound: (pathname) => <NotFound />,          // 404 页面
  onBefore: async (pathname) => {},              // 页面加载前钩子
  onAfter: async (pathname) => {},               // 页面加载后钩子
});

// 编程式导航
history.push('/about');
history.replace('/login');
```

---

#### sendRequest / GET / POST / sendJSON — 网络请求

基于 Fetch API 封装的网络请求工具，支持多种数据格式和超时控制。

```typescript
import { GET, POST, sendJSON, sendRequest, registerHostAlias } from 'clxx';

// 简单 GET 请求
const result = await GET('/api/list', { page: 1 });

// POST 表单
const result = await POST('/api/submit', { name: 'test' });

// 发送 JSON
const result = await sendJSON('/api/create', { title: 'new' });

// 完整配置
const result = await sendRequest({
  url: '/api/data',
  method: 'POST',
  sendType: 'json',        // 'normal' | 'text' | 'form' | 'json' | 'blob' | 'params' | 'buffer'
  data: { key: 'value' },
  timeout: 10000,           // 超时时间，默认 30s
  disableUrlCache: true,    // 禁用 URL 缓存
  transmitPageParam: true,  // 透传当前页面参数
});

// 注册 Host 别名
registerHostAlias({
  api: 'https://api.example.com',
});
// 使用别名发送请求
GET('api@/user/info', { id: 1 });
```

**SendType 类型：**

| 类型 | 说明 | data 类型 |
|------|------|----------|
| `normal` | GET 请求，数据附加到 URL | `Record<string, any>` / `string` |
| `text` | 文本请求体 | `string` |
| `form` | FormData 请求体 | `Record<string, any>` / `FormData` |
| `json` | JSON 字符串请求体 | `Record<string, any>` |
| `blob` | Blob 原始二进制 | `Blob` |
| `params` | URLSearchParams 请求体 | `Record<string, any>` / `URLSearchParams` |
| `buffer` | ArrayBuffer 请求体 | `ArrayBuffer` / `TypedArray` / `DataView` |

---

#### jsonp — JSONP 请求

```typescript
import { jsonp } from 'clxx';

const result = await jsonp('https://api.example.com/data', 'callback');
```

---

#### Countdown — 倒计时类

底层倒计时工具类，基于 `requestAnimationFrame` 实现精确计时。

```typescript
import { Countdown } from 'clxx';

const countdown = new Countdown({
  remain: 120,        // 剩余秒数
  format: 'his',      // 格式：d天 h时 i分 s秒
  onUpdate: (value) => {
    console.log(value); // { h: 0, i: 2, s: 0 }
  },
  onEnd: () => {
    console.log('倒计时结束');
  },
});

countdown.start();
// countdown.stop();  // 暂停，可再次 start 恢复
```

---

#### tick — 帧循环

基于 `requestAnimationFrame` 的循环执行函数，支持可选间隔。

```typescript
import { tick } from 'clxx';

// 每帧执行
const stop = tick(() => {
  // 每帧回调
});

// 指定间隔执行
const stop = tick(() => {
  // 每 1000ms 执行一次
}, 1000);

// 停止
stop();
```

---

#### is — 环境检测

常用的运行环境判断工具，结果缓存，避免重复检测。

```typescript
import { is } from 'clxx';

is('ios');         // iOS 平台（含 iPadOS 13+)
is('android');     // Android 平台
is('wechat');      // 微信环境
is('qq');          // QQ / QQ浏览器
is('alipay');      // 支付宝
is('weibo');       // 微博
is('douyin');      // 抖音
is('xiaohongshu'); // 小红书
is('toutiao');     // 今日头条
is('baidu');       // 百度 APP
is('touchable');   // 可触摸设备
```

---

#### ago — 相对时间格式化

将任意日期格式化为中文相对时间描述，支持过去和未来。

```typescript
import { ago } from 'clxx';

ago('2025-01-01');    // { num: x, unit: 'm', format: 'x个月前' }
ago(new Date());      // { num: 0, unit: 's', format: '刚刚' }
ago('2028-06-01');    // { num: x, unit: 'y', format: 'x年后' }
```

---

#### calendarTable — 月历数据

生成一个月的日历表格数据（6×7 的二维 dayjs 数组），可用于自定义日历组件。

```typescript
import { calendarTable } from 'clxx';

const table = calendarTable('2026-03-01');
// table: Dayjs[][] — 6 行 7 列

const table = calendarTable('2026-03', true);   // 从周日开始
const table = calendarTable('2026-03', false, false); // 不保证 6 行
```

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `usefulFormat` | `dayjs.ConfigType` | `dayjs()` | 日期值 |
| `startFromSunday` | `boolean` | `false` | 是否周日开始 |
| `sizeGuarantee` | `boolean` | `true` | 是否保证 6 行 |

---

#### waitFor / waitUntil — 等待工具

```typescript
import { waitFor, waitUntil } from 'clxx';

// 等待指定时间
await waitFor(1000); // 等待 1 秒

// 等待条件为真
const success = await waitUntil(() => document.querySelector('.target') !== null, 5000);
// success: true（条件满足）或 false（超时）
```

---

#### normalizeUnit / splitValue — CSS 值处理

```typescript
import { normalizeUnit, splitValue } from 'clxx';

normalizeUnit(100);         // '100px'
normalizeUnit('1.5rem');    // '1.5rem'
normalizeUnit('100');       // '100px'

splitValue(100);            // { num: 100, unit: 'px' }
splitValue('1.5rem');       // { num: 1.5, unit: 'rem' }
```

---

#### defaultScroll — 默认滚动控制

禁用/启用页面默认滚动行为（针对触摸事件）。

```typescript
import { defaultScroll } from 'clxx';

defaultScroll.disable();  // 禁止页面滚动
defaultScroll.enable();   // 恢复页面滚动
```

---

#### uniqKey — 唯一键生成

生成全局唯一的字符串标识。

```typescript
import { uniqKey } from 'clxx';

const key = uniqKey(); // 如 "m1abc1"
```

---

#### createPortalDOM — Portal 容器

创建挂载到 body 的 React Portal 容器，用于命令式渲染组件。

```typescript
import { createPortalDOM } from 'clxx';

const { mount, unmount, element } = createPortalDOM();
mount(<MyComponent />);  // 渲染组件到 body
unmount();                // 卸载并移除 DOM
```

---

#### setContextValue / getContextValue — 全局上下文

简单的全局键值存储，用于跨组件共享数据。

```typescript
import { setContextValue, getContextValue } from 'clxx';

setContextValue({ token: 'xxx', userId: 123 });
getContextValue('token');  // 'xxx'
getContextValue();         // { token: 'xxx', userId: 123 }
```

---

## 📋 完整导出列表

### 组件
| 导出 | 类型 | 说明 |
|------|------|------|
| `Container` | 组件 | 自适应根容器 |
| `Flex` / `FlexItem` | 组件 | Flex 布局 |
| `Row` / `RowStart` ~ `RowEvenly` | 组件 | 水平布局快捷组件 |
| `Col` / `ColStart` ~ `ColEvenly` | 组件 | 垂直布局快捷组件 |
| `AutoGrid` | 组件 | 自动网格 |
| `SafeArea` | 组件 | 安全区域 |
| `Clickable` | 组件 | 点击态 |
| `Overlay` | 组件 | 覆盖层 |
| `ScrollView` | 组件 | 滚动视图 |
| `CarouselNotice` | 组件 | 轮播公告 |
| `Indicator` | 组件 | 加载指示器 |
| `Countdowner` | 组件 | 倒计时 |
| `Ago` | 组件 | 相对时间 |

### 函数式调用
| 导出 | 说明 |
|------|------|
| `showToast` / `showUniqToast` | 轻提示 |
| `showDialog` | 对话框 |
| `showAlert` | 弹窗提示 |
| `showLoading` / `showLoadingAtLeast` | 加载指示 |

### Hooks
| 导出 | 说明 |
|------|------|
| `useWindowResize` | 窗口变化监听 |
| `useViewport` | Viewport meta 管理 |
| `useInterval` | 安全 setInterval |
| `useTick` | 帧循环 |
| `useUpdate` | 强制刷新 |

### 工具函数
| 导出 | 说明 |
|------|------|
| `createApp` / `history` / `getHistory` | 路由应用 |
| `GET` / `POST` / `sendJSON` / `sendRequest` / `sugarSend` | 网络请求 |
| `buildUrlByOption` / `registerHostAlias` | URL 构建与别名 |
| `jsonp` | JSONP 请求 |
| `Countdown` | 倒计时类 |
| `tick` | 帧循环函数 |
| `is` | 环境检测 |
| `ago` | 相对时间格式化 |
| `calendarTable` | 月历数据 |
| `waitFor` / `waitUntil` | 等待工具 |
| `normalizeUnit` / `splitValue` | CSS 值处理 |
| `defaultScroll` | 滚动控制 |
| `uniqKey` | 唯一键 |
| `createPortalDOM` | Portal 容器 |
| `setContextValue` / `getContextValue` | 全局上下文 |

---

## 📄 License

[MIT](LICENSE) © [Joye](https://github.com/joye61)
