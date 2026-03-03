import React, { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
  History,
} from "history";
import { Container, ContainerProps } from "../Container";
import pick from "lodash/pick";

export type RouterMode = "browser" | "hash" | "memory";
export type AwaitValue<T> = T | Promise<T>;

export interface CreateAppOption
  extends Omit<ContainerProps, "children"> {
  // 页面组件加载前触发的钩子函数
  onBefore?: (pathname: string) => AwaitValue<void>;
  // 页面组件加载后触发的钩子函数
  onAfter?: (pathname: string) => AwaitValue<void>;
  // 返回加载中占位组件
  loading?: (pathname: string) => AwaitValue<React.ReactNode>;
  // 根据路径加载并返回页面组件
  render?: (pathname: string) => AwaitValue<React.ReactNode>;
  // 页面未找到时的错误处理
  notFound?: (pathname: string) => AwaitValue<React.ReactNode>;
  // 路由模式
  mode?: RouterMode;
  // 默认路由路径
  default?: string;
  // 挂载目标元素（选择器或 DOM 元素）
  target: string | HTMLElement;
}

// 存储历史记录对象
export let history: null | History = null;
// 获取历史记录对象
export function getHistory(mode: RouterMode = "browser") {
  if (history === null) {
    const createMap: Record<RouterMode, () => History> = {
      browser: createBrowserHistory,
      hash: createHashHistory,
      memory: createMemoryHistory,
    };
    history = createMap[mode]();
  }
  return history;
}

/**
 * 创建带路由的APP对象，全局对象，绝大部分情况下只需要调用一次
 * @param option CreateAppOption
 */
export async function createApp(option: CreateAppOption) {
  // 设置默认的路由方式
  if (
    !option.mode ||
    ["browser", "hash", "memory"].indexOf(option.mode) === -1
  ) {
    option.mode = "browser";
  }
  // 设置默认路由路径
  if (!option.default) {
    option.default = "/index";
  }

  // 这里是为了确保历史记录对象在组件渲染之前一定存在
  history = getHistory(option.mode);

  // 提取关键数据
  const containerProps: ContainerProps = pick(option, [
    "designWidth",
    "globalStyle",
  ]);
  const { onBefore, onAfter, loading, render, notFound } = option;

  // 规范化路径：移除首尾斜杠
  const PATH_TRIM_REGEX = /^\/*|\/*$/g;
  const normalizePath = (path: string): string => {
    const normalized = path.replace(PATH_TRIM_REGEX, "");
    return normalized || option.default!.replace(PATH_TRIM_REGEX, "");
  };

  /**
   * 全局APP组件对象
   * @returns
   */
  const App = () => {
    const [page, setPage] = useState<React.ReactNode | null>(null);

    /**
     * 加载并渲染页面
     */
    const loadAndRenderPage = useCallback(
      async (pathname: string) => {
        const normalizedPath = normalizePath(pathname);

        // 如果有 loading 占位符，先显示
        if (typeof loading === "function") {
          setPage(await loading(normalizedPath));
        }

        // 页面加载前钩子
        await onBefore?.(normalizedPath);

        // 加载并显示页面
        if (typeof render === "function") {
          try {
            const pageContent = await render(normalizedPath);

            // 如果返回 null/undefined，视为页面未找到
            if (pageContent === null || pageContent === undefined) {
              if (typeof notFound === "function") {
                setPage(await notFound(normalizedPath));
              } else {
                // 默认 404 页面
                setPage(<div>Not Found: {normalizedPath}</div>);
              }
              return;
            }

            setPage(pageContent);
          } catch {
            // 动态 import 失败等场景
            if (typeof notFound === "function") {
              setPage(await notFound(normalizedPath));
            } else {
              setPage(<div>Not Found: {normalizedPath}</div>);
            }
            return;
          }
        }

        // 页面加载后钩子
        await onAfter?.(normalizedPath);
      },
      // 所有外部变量在闭包创建时已捕获，不会变化
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );

    /**
     * 监听路由变化
     */
    useEffect(() => {
      // 监听页面变化，一旦变化渲染新页面
      const unlisten = history!.listen(({ location }) => {
        loadAndRenderPage(location.pathname);
      });

      // 初始化时渲染当前路径对应的页面
      loadAndRenderPage(history!.location.pathname);

      // 卸载时，取消监听
      return unlisten;
    }, [loadAndRenderPage]);

    return <Container {...containerProps}>{page}</Container>;
  };

  // 获取挂载对象
  let mount: HTMLElement | null = null;
  if (typeof option.target === "string") {
    mount = document.querySelector(option.target);
  } else if (option.target instanceof HTMLElement) {
    mount = option.target;
  }

  if (!mount) {
    throw new Error(
      `Mount target not found: ${typeof option.target === "string" ? option.target : "invalid element"}`
    );
  }

  const root = createRoot(mount);
  root.render(<App />);
}
