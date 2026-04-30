/**
 * 高德地图 SDK 动态加载器
 *
 * 设计目标：
 *   - clxx 库被静态 import 时绝不携带高德地图 SDK；
 *   - 只有用户真正使用 MapLocationSelection 时才通过运行时 import 触发拉取；
 *   - 同一密钥在同一个页面只加载一次，多次调用复用同一个 Promise。
 *
 * 实现方式：
 *   通过动态 `import` 一个由 Blob URL 包装的远程脚本（loader.js），
 *   等价于在页面里插入 `<script src="https://webapi.amap.com/loader.js"></script>`。
 *   这样既满足“动态 import”的语义（不会进入 clxx 的静态依赖图），
 *   又避免了对 `@amap/amap-jsapi-loader` npm 包的硬依赖。
 */

const LOADER_URL = "https://webapi.amap.com/loader.js";

interface AMapNamespace {
  Map: any;
  Geocoder: any;
  AutoComplete: any;
  PlaceSearch: any;
  Geolocation: any;
  LngLat: any;
  Pixel: any;
  [key: string]: any;
}

interface AMapLoaderLike {
  load(opts: {
    key: string;
    version?: string;
    plugins?: string[];
  }): Promise<AMapNamespace>;
}

declare global {
  interface Window {
    AMapLoader?: AMapLoaderLike;
    _AMapSecurityConfig?: { securityJsCode?: string; serviceHost?: string };
  }
}

let scriptPromise: Promise<AMapLoaderLike> | null = null;

/**
 * Chrome 对「2D Canvas 上反复 getImageData」会告警，建议在 getContext('2d') 时传入
 * `{ willReadFrequently: true }`。高德 JSAPI 2.x 内部地图/定位插件未带该属性，控制台会刷
 * “Canvas2D: Multiple readback operations...”——功能无碍，但干扰调试。
 *
 * 在首次拉取高德脚本**之前**打一次原型补丁，合并 willReadFrequently；全页只对 2d 上下文生效，
 * 与 HTML 标准对该 hint 的语义一致（读回频繁时更应设为 true）。
 */
let didPatchCanvasGetContext = false;
function patchCanvasGetContextForAMapHint(): void {
  if (didPatchCanvasGetContext) return;
  if (typeof HTMLCanvasElement === "undefined") return;
  didPatchCanvasGetContext = true;
  const proto = HTMLCanvasElement.prototype;
  const orig = proto.getContext;
  function patchedGetContext(
    this: HTMLCanvasElement,
    type: string,
    contextAttributes?: unknown,
  ): unknown {
    if (type === "2d") {
      const base =
        contextAttributes && typeof contextAttributes === "object"
          ? { ...(contextAttributes as CanvasRenderingContext2DSettings) }
          : {};
      base.willReadFrequently = true;
      return orig.call(this, "2d", base);
    }
    return orig.call(this, type as never, contextAttributes as never);
  }
  // 包装后无法同时满足 lib.dom 对 getContext 的全部重载签名，运行期委托给原生实现即可。
  proto.getContext = patchedGetContext as typeof HTMLCanvasElement.prototype.getContext;
}

function ensureLoaderScript(): Promise<AMapLoaderLike> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("AMap loader requires a browser env"));
  }
  if (window.AMapLoader) return Promise.resolve(window.AMapLoader);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<AMapLoaderLike>((resolve, reject) => {
    // 复用已存在的 script 标签（同一文档内多处使用时）
    const existed = document.querySelector<HTMLScriptElement>(
      `script[src="${LOADER_URL}"]`,
    );
    const onReady = () => {
      if (window.AMapLoader) resolve(window.AMapLoader);
      else reject(new Error("AMapLoader not found after loader.js loaded"));
    };
    if (existed) {
      if (window.AMapLoader) {
        resolve(window.AMapLoader);
        return;
      }
      existed.addEventListener("load", onReady, { once: true });
      existed.addEventListener(
        "error",
        () => reject(new Error("Failed to load AMap loader.js")),
        { once: true },
      );
      return;
    }
    const script = document.createElement("script");
    script.src = LOADER_URL;
    script.async = true;
    script.onload = onReady;
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Failed to load AMap loader.js"));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export interface LoadAMapOptions {
  key: string;
  securityJsCode?: string;
  version?: string;
  plugins?: string[];
}

const namespacePromiseMap = new Map<string, Promise<AMapNamespace>>();

export function loadAMap(opts: LoadAMapOptions): Promise<AMapNamespace> {
  const {
    key,
    securityJsCode,
    version = "2.0",
    plugins = [
      "AMap.Geocoder",
      "AMap.AutoComplete",
      "AMap.PlaceSearch",
      "AMap.Geolocation",
    ],
  } = opts;

  // 不同的 key 视为不同实例缓存（同一 key 下复用）
  const cacheKey = `${key}::${version}::${plugins.join(",")}`;
  const cached = namespacePromiseMap.get(cacheKey);
  if (cached) return cached;

  const promise = (async () => {
    patchCanvasGetContextForAMapHint();
    if (securityJsCode) {
      // 必须在 loader.load 之前注入
      window._AMapSecurityConfig = {
        ...(window._AMapSecurityConfig ?? {}),
        securityJsCode,
      };
    }
    const loader = await ensureLoaderScript();
    return loader.load({ key, version, plugins });
  })().catch((err) => {
    // 失败后允许下次重试
    namespacePromiseMap.delete(cacheKey);
    throw err;
  });

  namespacePromiseMap.set(cacheKey, promise);
  return promise;
}

export type { AMapNamespace };
