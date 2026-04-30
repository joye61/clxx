// 百度地图 BMapGL SDK 动态加载器。
//
// 设计目标：
//   - clxx 库被静态 import 时绝不携带百度地图 SDK；
//   - 只有用户真正使用 MapLocationSelection 且选择 provider="bmap" 时才注入 <script>；
//   - 同一 ak 在同一个页面只加载一次，多次调用复用同一个 Promise；
//   - SDK 加载完成的判定靠 `callback` 查询参数（百度官方支持），脚本执行完会调用我们
//     注入的全局函数，避免使用 onload 但 BMapGL 还未挂载的竞态。

const SCRIPT_URL_BASE = "https://api.map.baidu.com/api?v=1.0&type=webgl&ak=";

declare global {
  interface Window {
    BMapGL?: any;
  }
}

const cachedPromiseMap = new Map<string, Promise<any>>();

export function loadBMap(opts: { ak: string }): Promise<any> {
  const { ak } = opts;
  if (!ak) {
    return Promise.reject(new Error("BMap ak is required"));
  }
  if (typeof window === "undefined") {
    return Promise.reject(new Error("BMap loader requires a browser env"));
  }
  // 已有完整加载的 BMapGL，直接返回
  if (window.BMapGL) {
    const ready = Promise.resolve(window.BMapGL);
    cachedPromiseMap.set(ak, ready);
    return ready;
  }
  const cached = cachedPromiseMap.get(ak);
  if (cached) return cached;

  const cbName = `__clxxBMapInit_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2)}`;

  const promise = new Promise<any>((resolve, reject) => {
    (window as any)[cbName] = () => {
      delete (window as any)[cbName];
      if (window.BMapGL) {
        resolve(window.BMapGL);
      } else {
        // 极端情况：脚本回调被触发但 BMapGL 仍未挂载（一般是 ak 错误的兜底）
        reject(new Error("BMapGL not available after script callback"));
      }
    };

    const script = document.createElement("script");
    script.src = `${SCRIPT_URL_BASE}${encodeURIComponent(ak)}&callback=${cbName}`;
    script.async = true;
    script.onerror = () => {
      delete (window as any)[cbName];
      cachedPromiseMap.delete(ak);
      reject(new Error("Failed to load BMapGL SDK"));
    };
    document.head.appendChild(script);
  }).catch((err) => {
    cachedPromiseMap.delete(ak);
    throw err;
  });

  cachedPromiseMap.set(ak, promise);
  return promise;
}
