import React, { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory, createHashHistory, createMemoryHistory, History } from "history";
import { Container, ContainerProps } from "../Container";
import { ContextValue, setContextValue } from "../context";
import pick from "lodash/pick";

export type RouteMethod = "browser" | "hash" | "memory";
export type AwaitValue<T> = T | Promise<T>;

export interface CreateAppOption extends Omit<ContainerProps, "children">, ContextValue {
  // 加载页面组件之前触发的钩子函数
  onBeforeRenderPage?: (pathname?: string) => AwaitValue<void>;
  // 加载页面组件之后触发的钩子函数
  onAfterRenderPage?: (pathname?: string) => AwaitValue<void>;
  // 加载页面组件之前有一段空白期，这里渲染的是这段空白期的内容
  renderLoading?: (pathname?: string) => AwaitValue<React.ReactNode>;
  // 加载并返回页面组件
  renderPage?: (pathname?: string) => AwaitValue<React.ReactNode>;
  // 路由环境
  routeMethod?: RouteMethod;
  // 默认路由
  defaultRoute?: string;
  // 挂载目标
  target: string | HTMLElement;
}

// 存储历史记录对象
export let history: null | History = null;
// 获取历史记录对象
export function getHistory(routeMethod: RouteMethod = "browser") {
  if (history === null) {
    const createMap: Record<RouteMethod, () => History> = {
      browser: createBrowserHistory,
      hash: createHashHistory,
      memory: createMemoryHistory,
    };
    history = createMap[routeMethod]();
  }
  return history;
}

/**
 * 创建带路由的APP对象，全局对象，绝大部分情况下只需要调用一次
 * @param option CreateAppOption
 */
export async function createApp(option: CreateAppOption) {
  // 设置默认的路由方式
  if (!option.routeMethod || ["browser", "hash", "memory"].indexOf(option.routeMethod) === -1) {
    option.routeMethod = "browser";
  }
  // 设置默认路由路径
  if (!option.defaultRoute) {
    option.defaultRoute = "/index";
  }

  // 这里是为了确保历史记录对象在组件渲染之前一定存在
  history = getHistory(option.routeMethod);

  // 提取关键数据
  const context: ContextValue = pick(option, ["minDocWidth", "maxDocWidth"]);
  const containerProps: ContainerProps = pick(option, ["designWidth", "globalStyle"]);
  const { onBeforeRenderPage, onAfterRenderPage, renderLoading, renderPage } = option;

  // 设置上下文属性
  setContextValue(context);

  /**
   * 全局APP组件对象
   * @returns
   */
  const App = () => {
    const [page, setPage] = useState<React.ReactNode | null>(null);

    /**
     * 渲染一个新页面
     */
    const showPage = useCallback(async (pathname: string) => {
      const pathReg = /^\/*|\/*$/g;
      pathname = pathname.replace(pathReg, "");
      if (!pathname) {
        pathname = option.defaultRoute!.replace(pathReg, "");
      }

      // 如果有loading，要先显示loading
      if (typeof renderLoading === "function") {
        setPage(renderLoading?.(pathname));
      }
      // 加载页面之前可能会存在的逻辑
      await onBeforeRenderPage?.(pathname);
      // 加载并显示页面
      setPage(await renderPage?.(pathname));
      // 加载页面之后可能存在的逻辑
      await onAfterRenderPage?.();
    }, []);

    /**
     * 监听变化
     */
    useEffect(() => {
      // 监听页面变化，一旦变化渲染新页面
      const unlisten = history!.listen(({ location }) => {
        showPage(location.pathname);
      });
      // 初始化时渲染一个页面
      showPage(history!.location.pathname);

      // 卸载时，取消监听
      return unlisten;
    }, []);

    return <Container {...containerProps}>{page}</Container>;
  };

  // 获取挂载对象
  let mount: HTMLElement | null = null;
  if (typeof option.target === "string") {
    mount = document.querySelector(option.target);
  } else if (option.target instanceof HTMLElement) {
    mount = option.target;
  }

  // 挂载组件
  await new Promise<void>((resolve) => {
    ReactDOM.render(<App />, mount, resolve);
  });
}
