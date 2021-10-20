import React, { useCallback, useEffect, useState } from "react";
import {
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
  History,
  State,
  To,
} from "history";
import { Container, ContainerProps } from "../Container";

export let history: null | History<State> = null;

export interface CreateAppResult {
  history: History<State>;
  goto: (to: To, state?: State) => void;
  goBack: () => void;
  replace: (to: To, state?: State) => void;
  App: React.FunctionComponent<AppProps>;
}

export interface AppProps extends ContainerProps {
  // 加载页面组件之前触发的钩子函数
  onBeforeLoadPage?: (pathname?: string) => void | Promise<void>;
  // 加载页面组件之前有一段空白期，这里渲染的是这段空白期的内容
  renderLoading?: (pathname?: string) => React.ReactNode | Promise<React.ReactNode>;
  // 加载并返回页面组件
  loadPage: (pathname?: string) => React.ReactNode | Promise<React.ReactNode>;
  // 默认路由
  defaultRoute?: string;
}

/**
 * 创建一个带路由的单页应用
 * @param routerEnv 路由环境
 * @returns CreateAppResult
 */
export function createAppWithRouter(
  routerEnv: "browser" | "hash" | "memory" = "browser"
): CreateAppResult {
  const createMap: Record<string, () => History<State>> = {
    browser: createBrowserHistory,
    hash: createHashHistory,
    memory: createMemoryHistory,
  };
  if (!createMap[routerEnv]) {
    throw new Error(
      'Illegal routing environment，The legal value is "browser" | "hash" | "memory"'
    );
  }
  if (history === null) {
    history = createMap[routerEnv]();
  }
  const goto = history.push.bind(history);
  const goBack = history.back.bind(history);
  const replace = history.replace.bind(history);

  /**
   * 应用程序组价，默认包含了Container
   * @param props
   * @returns
   */
  const App = (props: AppProps) => {
    const {
      renderLoading,
      onBeforeLoadPage,
      loadPage,
      defaultRoute = "index",
      ...containerProps
    } = props;
    const [page, setPage] = useState<React.ReactNode | null>(null);

    /**
     * 渲染一个新页面
     */
    const renderPage = useCallback(
      async (pathname: string) => {
        const pathReg = /$\/*|\/*^/g;
        pathname = pathname.replace(pathReg, "");
        if (!pathname) {
          pathname = defaultRoute.replace(pathReg, "");
        }
        // 如果有loading，要先显示loading
        setPage(renderLoading?.(pathname));
        // 加载页面之前可能会存在的逻辑
        await onBeforeLoadPage?.(pathname);
        // 加载并显示页面
        setPage(await loadPage(pathname));
      },
      [renderLoading, onBeforeLoadPage, loadPage, defaultRoute]
    );

    /**
     * 监听变化
     */
    useEffect(() => {
      // 监听页面变化，一旦变化渲染新页面
      const unlisten = history!.listen(({ location }) => {
        renderPage(location.pathname);
      });
      // 初始化时渲染一个页面
      renderPage(history!.location.pathname);

      return unlisten;
    }, [renderPage]);

    return <Container {...containerProps}>{page}</Container>;
  };

  return { history, goto, goBack, replace, App };
}
