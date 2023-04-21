# v2.0.8

## 功能函数

- [`ago`](./src/Ago/index.tsx)：显示多久以前
- [`calendarTable`](./src/utils/calendarTable.ts)：创建一个月历视图的原始数据表
- [`Countdown`](./src/utils/Countdown.ts)：倒计时器，最大可以到天
- [`createApp`](./src/utils/createApp.tsx)：创建一个带路由的 APP 对象，这是个非常实用的功能函数
- [`defaultScroll`](./src/utils/defaultScroll.ts)：禁用和启用默认滚动
- [`createPortalDOM`](./src/utils/dom.tsx)：任意位置创建一个 DOM 节点，用来挂载和卸载 React 组件
- [`is`](./src/utils/is.ts)：一些简单的环境判断
- [`jsonp`](./src/utils/jsonp.ts)：发送一个 jsonp 请求
- [`GET，POST`](./src/utils/request.ts)：ajax 请求的简单封装
- [`tick`](./src/utils/tick.ts)：嘀嗒器，每帧都会执行
- [`uniqKey`](./src/utils/uniqKey.ts)：生成一个全局唯一的 key
- [`waitUntil`](./src/utils/wait.ts)：执行某种检测，直接条件为真或者超时才返回

## 基础组件

- [`<Ago>`](./src/Ago/index.tsx)：显示多久以前
- [`<AutoGrid>`](./src/AutoGrid/index.tsx)：里面的对象会自动网格排列
- [`<CarouselNotice>`](./src/CarouselNotice/index.tsx)：滚动走马灯
- [`<Clickable>`](./src/Clickable/index.tsx)：一个可点击的对象
- [`<Container>`](./src/Container/index.tsx)：这是一个全局容器，主要设置移动端环境，自适应等逻辑
- [`<Countdowner>`](./src/Countdowner/index.tsx)：倒计时器
- [`<Row>|<RowStart>|<RowEnd>|<RowBetween>|<RowCenter>|<RowAround>|<RowEvenly>`](./src/Flex/Row.tsx)：水平弹性布局
- [`<Col>|<ColStart>|<ColEnd>|<ColBetween>|<ColCenter>|<ColAround>|<ColEvenly>`](./src/Flex/Col.tsx)：垂直弹性布局
- [`<Indicator>`](./src/Indicator/index.tsx)：转动的菊花，用来作为Loading组件的一部分
- [`<Overlay>`](./src/Overlay/index.tsx)：一个全屏覆盖框，会覆盖可操作区域
- [`<SafeArea>`](./src/SafeArea/index.tsx)：这个组件会自动剔除手机的非操作区域
- [`<ScrollView>`](./src/ScrollView/index.tsx)：滚动容器，自带原生滚动条
- [`showDialog`](./src/Dialog/index.tsx)：函数式调用，显示一个弹框组件
- [`showAlert`](./src/Alert/index.tsx)：函数式调用，模拟`window.alert`，但UI可定制
- [`showToast|showUniqToast`](./src/Toast/index.tsx)：函数式调用，显示一个Toast组件
- [`showLoading|showLoadingAtLeast`](./src/Loading/index.tsx)：函数式调用，显示一个Loading组件
