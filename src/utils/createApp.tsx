import React, { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
  History,
} from "history";
import { Container, ContainerProps } from "../Container";

export type RouterMode = "browser" | "hash" | "memory";
export type AwaitValue<T> = T | Promise<T>;

export interface CreateAppOption extends Omit<ContainerProps, "children"> {
  /** 页面加载前触发，可 async；早于 render */
  onBefore?: (pathname: string) => AwaitValue<void>;
  /** 页面成功渲染后触发，可 async；404 / 错误场景不触发 */
  onAfter?: (pathname: string) => AwaitValue<void>;
  /** 返回加载中占位节点，在 render 执行期间展示 */
  loading?: (pathname: string) => AwaitValue<React.ReactNode>;
  /** 根据路径返回页面节点；返回 null/undefined 触发 notFound */
  render?: (pathname: string) => AwaitValue<React.ReactNode>;
  /** render 返回 null/undefined（404）时调用 */
  notFound?: (pathname: string) => AwaitValue<React.ReactNode>;
  /** render 抛出错误时调用；未提供时降级到 notFound */
  onError?: (pathname: string, error: unknown) => AwaitValue<React.ReactNode>;
  /** 路由模式，默认 browser */
  mode?: RouterMode;
  /** 路径为 / 或空时使用的默认路径，默认 /index */
  default?: string;
  /** 路由切换时自动滚动到顶部，移动端推荐开启，默认 true */
  scrollToTop?: boolean;
  /** 开启 React.StrictMode，默认 false */
  strict?: boolean;
  /** 挂载目标（CSS 选择器或 HTMLElement） */
  target: string | HTMLElement;
}

// 存储历史记录对象
export let history: null | History = null;

// 获取历史记录对象
export function getHistory(mode: RouterMode = "browser"): History {
  if (history === null) {
    const factories: Record<RouterMode, () => History> = {
      browser: createBrowserHistory,
      hash: createHashHistory,
      memory: createMemoryHistory,
    };
    history = factories[mode]();
  }
  return history;
}

const VALID_MODES = new Set<RouterMode>(["browser", "hash", "memory"]);
// 模块级常量，移除路径首尾斜杠；g 标志确保首尾各自替换一次
const PATH_TRIM_RE = /^\/*|\/*$/g;

/**
 * 创建带路由的 App，全局单例，通常只调用一次。
 * @param option CreateAppOption
 */
export function createApp(option: CreateAppOption) {
  // 不修改入参，用局部变量保存规范化后的值
  const mode: RouterMode =
    option.mode && VALID_MODES.has(option.mode) ? option.mode : "browser";
  const defaultPath = (option.default ?? "/index").replace(PATH_TRIM_RE, "");
  const scrollToTop = option.scrollToTop !== false;

  // 确保 history 在组件渲染前已就绪
  history = getHistory(mode);

  // 提取 ContainerProps（含 maxWidth，原 pick 遗漏此项）
  const { designWidth, maxWidth, globalStyle } = option;
  const containerProps: ContainerProps = { designWidth, maxWidth, globalStyle };

  const { onBefore, onAfter, loading, render, notFound, onError } = option;

  // 规范化路径：移除首尾斜杠，空路径回退到 defaultPath
  const normalizePath = (path: string): string => {
    const normalized = path.replace(PATH_TRIM_RE, "");
    return normalized || defaultPath;
  };

  /**
   * 全局 App 组件，仅在 createApp 内实例化一次
   */
  const App = () => {
    const [page, setPage] = useState<React.ReactNode>(null);
    // 导航版本号：每次发起新导航自增；过时的异步回调检测到不匹配后静默丢弃，
    // 防止慢请求在更新的导航完成后覆盖页面（竞态条件）
    const navIdRef = useRef(0);

    const loadPage = useCallback(
      async (pathname: string) => {
        const navId = ++navIdRef.current;
        const path = normalizePath(pathname);

        // 1. 展示加载占位
        if (typeof loading === "function") {
          const loadingNode = await loading(path);
          if (navId !== navIdRef.current) return;
          setPage(loadingNode);
        }

        // 2. 前置钩子
        await onBefore?.(path);
        if (navId !== navIdRef.current) return;

        // 3. 渲染页面
        if (typeof render === "function") {
          let content: React.ReactNode;
          let loadError: unknown;
          let hasError = false;

          try {
            content = await render(path);
          } catch (err) {
            loadError = err;
            hasError = true;
          }

          if (navId !== navIdRef.current) return;

          if (hasError) {
            // render 抛出异常：优先 onError，降级 notFound，再降级内置提示
            const errNode =
              typeof onError === "function" ? (
                await onError(path, loadError)
              ) : typeof notFound === "function" ? (
                await notFound(path)
              ) : (
                <div>Error: {path}</div>
              );
            if (navId !== navIdRef.current) return;
            setPage(errNode);
            return;
          }

          if (content == null) {
            // render 返回 null/undefined：404
            const notFoundNode =
              typeof notFound === "function" ? (
                await notFound(path)
              ) : (
                <div>Not Found: {path}</div>
              );
            if (navId !== navIdRef.current) return;
            setPage(notFoundNode);
            return;
          }

          // 成功：切换前滚回顶部，再替换页面内容
          if (scrollToTop) window.scrollTo(0, 0);
          setPage(content);
        }

        if (navId !== navIdRef.current) return;

        // 4. 后置钩子（仅成功渲染后调用）
        await onAfter?.(path);
      },
      // 所有依赖均来自 createApp 闭包，生命周期内不变
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    useEffect(() => {
      // 初始渲染当前路径
      loadPage(history!.location.pathname);
      // 监听后续路由变化，返回 unlisten 作为 cleanup
      return history!.listen(({ location }) => loadPage(location.pathname));
    }, [loadPage]);

    return <Container {...containerProps}>{page}</Container>;
  };

  // 解析挂载目标
  let mount: HTMLElement | null;
  if (typeof option.target === "string") {
    mount = document.querySelector<HTMLElement>(option.target);
  } else if (option.target instanceof HTMLElement) {
    mount = option.target;
  } else {
    mount = null;
  }

  if (!mount) {
    throw new Error(
      `createApp: mount target not found — "${
        typeof option.target === "string" ? option.target : "[invalid element]"
      }"`,
    );
  }

  const root = createRoot(mount);
  root.render(
    option.strict ? (
      <React.StrictMode>
        <App />
      </React.StrictMode>
    ) : (
      <App />
    ),
  );
}
