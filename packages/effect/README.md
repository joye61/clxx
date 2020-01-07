# 引用

```ts
import { useGlobalState, setGlobalState, getGlobalState } from "cl-util";
```

# 第一步

任意位置初始化并设置全局状态

```ts
// setGlobalState的函数签名是一个键值对，键和值类型都任意
// setGlobalState(key: any, value: any)

setGlobalState("ticker-test", 1);

// 甚至可以
setGlobalState(Symbol(), {a:1, b: "hello", c: []})
```

# 第二步

在用到全局状态的组件中调用自定义Hooks

```ts

// useGlobalState的返回类型和setState类似，但是
// useGlobalState的参数是一个与setGlobalState对应的键

function MyComponent(){
  const [ticker, setTicker] = useGlobalState("ticker-test");
  
  return (
    <div>
      <button 
        onClick={()=>{
          setTicker(ticker+1);
        }}
      >
        点击更新ticker值
      </button>
      <p>当前{ticker}</p>
    </div>
  );
}
```

# 其他

只要`setGlobalState`被初始化过了，接下来可以在任意地方调用，甚至可以在组件之外调用

```ts
// 假设当前代码位于组件体之外
setInterval(()=>{
  const ticker = getGlobalState("ticker-test");
  setGlobalState("ticker-test", ticker + 1);
}, 1000)
```