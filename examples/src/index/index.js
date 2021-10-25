import { React } from "react";
import { history } from "@";

const pageConfig = [
  { path: "indicator", title: "Indicator菊花转圈指示器", enable: true },
  { path: "countdown", title: "Countdown倒计时", enable: true },
  { path: "alert", title: "showAlert弹框功能", enable: true },
  { path: "dialog", title: "showDialog对话框", enable: true },
  // { path: 'layout', title: '常用布局组件', enable: false },
  { path: "toast", title: "showToast轻提示", enable: true },
  { path: "carouse-notice", title: "CarouseNotice轮播公告", enable: true },
  { path: "loading", title: "showLoading加载", enable: true },
  { path: "scrollview", title: "ScrollView滚动容器", enable: true },
  { path: "ago", title: "Ago多久以前", enable: true },
  { path: "overlay", title: "Overlay通用覆盖层", enable: true },
  { path: "clickable", title: "Clickable可触摸组件", enable: true },
  // { path: 'privacy', title: 'Privacy去标识化', enable: true },
  { path: "autogrid", title: "AutoGrid生成自动对齐的表格", enable: true },
  { path: "picker", title: "showPicker选择器", enable: true },
  // { path: 'image-picker', title: 'ImagePicker图片选择器', enable: true },
];

export default function Index() {
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
