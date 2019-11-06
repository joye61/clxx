# 弹框 `Alert`

这是一个可以取代原生的弹框方法，具备以下特点：

- 基于`React`组件实现的统一 UI
- 可以定制**确定**和**取消**按钮
- 弹框内容可以是**React 组件**


> 对于一个简单的取代`window.alert`功能而言，绝大部分基于 React 实现的库都是通过提供一个类似`<AlertComponent />`之类的组件，然后要求使用者通过类似 `state={showAlert: true}` 之类的状态来控制弹框的显示隐藏逻辑。
>
> 但显然大部分时候直接以函数方式调用 `alert("hello world")` 更加简单。`cl-utils` 的[自定义弹框](./src/Alert/README.md)就是这么做的，虽然使用 React 实现了取代 `window.alert` 的 UI，但是使用方式却跟原生调用体验保持了一致。


# 使用

`Alert` 的首字母为大写，为了不影响浏览器默认的 `window.alert` 功能

```javascript
import { Alert } from "cl-utils";
```


## 1、替代浏览器默认的 `window.alert`

这种方式下，只需要传递简单值作为函数的第一个参数即可。如数字和字符串

<p><img src="../../assets/alert.gif" width="30%"></p>

```javascript
// 传递简单值
Alert("这是个弹框的测试");
```

## 2、通过对象方式进行弹框定制

以下通过传递对象参数添加了一个取消按钮

<p>
  <img src="../../assets/alert-with-cancel.gif" width="50%">
</p>

```javascript
// 带取消按钮的弹框
Alert({
  content: "带取消按钮的弹框测试",
  showCancel: true
});

// 弹框内容可以是任意的React组件
Alert({
  content: (
    <p>
      hello<span>world</span>
    </p>
  ),
  showCancel: true
});
```

对象参数声明如下（采用TypeScript声明）：

```typescript
// 回掉函数定义，回调函数没有参数
type Callback = () => void;

// 当参数为对象时，对象的类型定义
interface AlertComponentProps {
  // 弹框内容，可以为React组件，也可以是普通文本，数字等。必填项
  content: React.ReactNode;
  // 是否显示遮罩，即弹框背景有个半透明黑色遮挡内容，默认：true
  showMask?: boolean;
  // 是否显示取消按钮；默认：false
  showCancel?: boolean;
  // 取消按钮内容，可以是任意内容，默认：取消
  cancelContent?: React.ReactNode;
  // 确认按钮内容，可以是任意内容，默认：确认
  confirmContent?: React.ReactNode;

  // 点击确定按钮时触发的回调；选填
  onConfirm?: Callback;
  // 点击取消按钮时触发的回调；选填
  onCancel?: Callback;
  // 弹框消失时触发的回调，动画完全结束时会触发；选填
  onHide?: Callback;
}
```


