import "./index.scss";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { history } from "./env";
import { Container, setContextValue } from "@";

// setContextValue({ designWidth: 375 });

const pageConfig = [
  { path: 'indicator', title: 'Indicator菊花转圈指示器', enable: true },
  { path: "countdown", title: "Countdown倒计时", enable: true },
  { path: 'alert', title: 'showAlert弹框功能', enable: true },
  { path: 'dialog', title: 'showDialog对话框', enable: true },
  // { path: 'layout', title: '常用布局组件', enable: false },
  { path: "toast", title: "showToast轻提示", enable: true },
  { path: 'carouse-notice', title: 'CarouseNotice轮播公告', enable: true },
  { path: 'loading', title: 'showLoading加载', enable: true },
  { path: 'scrollview', title: 'ScrollView滚动容器', enable: true },
  { path: "ago", title: "Ago多久以前", enable: true },
  { path: "overlay", title: "Overlay通用覆盖层", enable: true },
  { path: 'clickable', title: 'Clickable可触摸组件', enable: true },
  // { path: 'privacy', title: 'Privacy去标识化', enable: true },
  { path: 'autogrid', title: 'AutoGrid生成自动对齐的表格', enable: true },
  // { path: 'image-picker', title: 'ImagePicker图片选择器', enable: true },
];

function Home() {
  return (
    <ul className="Home">
      {pageConfig.map((item) => {
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
  const [page, setPage] = useState(null);

  useEffect(() => {
    const loadPage = async (path) => {
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
                  history.back();
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
    history.listen(({ location }) => {
      loadPage(location.pathname).then((page) => {
        setPage(page);
      });
    });

    // 初始化时渲染的页面
    loadPage(history.location.pathname).then((page) => {
      setPage(page);
    });
  }, []);

  return <Container>{page}</Container>;
}

ReactDOM.render(<App />, document.getElementById("root"));
