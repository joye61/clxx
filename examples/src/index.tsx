import "./index.scss";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { history } from "./env";
import { AppContainer } from "../../packages/adaptive/build/AppContainer";

const pageConfig = [
  { path: "adaptive", title: "页面自适应容器", enable: false },
  { path: "alert", title: "可取代window.alert的弹框功能", enable: true },
  { path: "base", title: "基础依赖", enable: false },
  { path: "calendar", title: "日历宫格视图", enable: true },
  { path: "cascade-picker", title: "级联选择器", enable: true },
  { path: "clickable", title: "可防止点击穿透的点击容器", enable: true },
  { path: "countdown", title: "倒计时组件", enable: true },
  { path: "datetime-picker", title: "日期时间选择器", enable: true },
  { path: "dialog", title: "自带动画功能的对话框", enable: true },
  { path: "effect", title: "一些副作用effect", enable: false },
  { path: "image-editor", title: "图片编辑器", enable: false },
  { path: "image-preview", title: "图片预览功能", enable: false },
  { path: "image-picker", title: "图片选择器", enable: true },
  { path: "layout", title: "常用布局组件", enable: true },
  { path: "lazyimage", title: "图片懒加载组件", enable: true },
  { path: "loading", title: "loading两个", enable: true },
  { path: "lottery", title: "抽奖功能", enable: false },
  { path: "picker", title: "通用选择器", enable: true },
  { path: "rolling-notice", title: "垂直滚动公告", enable: true },
  { path: "scrollview", title: "滚动容器", enable: true },
  { path: "swiper", title: "swiper功能封装", enable: true },
  { path: "toast", title: "仿客户端的Toast轻提示", enable: true },
  { path: "waterfall", title: "瀑布流布局功能", enable: true }
];

function Home() {
  return (
    <ul className="Home">
      {pageConfig.map(item => {
        return (
          <li
            className={item.enable ? "item" : "item-disable"}
            key={item.path}
            onClick={() => {
              if (item.enable) {
                history.push(`/${item.path}`);
              }
            }}
          >
            {item.title}
            <svg viewBox="0 0 1024 1024">
              <path d="M347.687 144.188l-52.761 52.238 313.928 316.082-316.568 313.42 52.314 52.673 369.322-365.663z" />
            </svg>
          </li>
        );
      })}
    </ul>
  );
}

function App() {
  const [page, setPage] = useState<React.ReactElement | null>(null);

  useEffect(() => {
    const loadPage = async (path: string) => {
      const module = path.replace(/^\/*|\/*$/g, "");
      if (!module) {
        return <Home />;
      } else {
        const result = await import(`./${module}/index`);
        return (
          <>
            <div className="backHome">
              <button
                onClick={() => {
                  history.goBack();
                }}
              >
                回到首页
              </button>
            </div>
            <div className="demo">
              <result.default />
            </div>
          </>
        );
      }
    };

    // 每次记录变更时渲染新页面
    history.listen(location => {
      loadPage(location.pathname).then(page => {
        setPage(page);
      });
    });

    // 初始化时渲染的页面
    loadPage(history.location.pathname).then(page => {
      setPage(page);
    });
  }, []);

  return <AppContainer>{page}</AppContainer>;
}

ReactDOM.render(<App />, document.getElementById("root"));
