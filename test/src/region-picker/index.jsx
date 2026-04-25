import { showRegionPicker } from "@";
import { useState } from "react";

export default function RegionPickerDemo() {
  const [result, setResult] = useState("");
  const [initial, setInitial] = useState(null);

  const openDefault = () => {
    showRegionPicker({
      value: initial || undefined,
      onConfirm: (sel) => {
        const text = `${sel.province.label} / ${sel.city.label} / ${sel.district.label}`;
        setResult(text);
        setInitial([sel.province.value, sel.city.value, sel.district.value]);
      },
      onCancel: () => {
        console.log("取消选择");
      },
    });
  };

  const openWithInitial = () => {
    showRegionPicker({
      // 广东 / 广州 / 天河区
      value: ["440000", "440100", "440106"],
      title: "带初始值",
      onConfirm: (sel) => {
        setResult(
          `${sel.province.label} / ${sel.city.label} / ${sel.district.label}`,
        );
      },
    });
  };

  const openCustomTheme = () => {
    showRegionPicker({
      primary: "#e53935",
      title: "京东红主题",
      onConfirm: (sel) => {
        setResult(
          `${sel.province.label} / ${sel.city.label} / ${sel.district.label}`,
        );
      },
    });
  };

  const openNoRounded = () => {
    showRegionPicker({
      rounded: false,
      title: "无圆角",
      onConfirm: (sel) => {
        setResult(
          `${sel.province.label} / ${sel.city.label} / ${sel.district.label}`,
        );
      },
    });
  };

  const openCustomLabels = () => {
    showRegionPicker({
      labels: { province: "选省份", city: "选城市", district: "选区县" },
      cancelText: "放弃",
      confirmText: "选好了",
      title: "自定义文案",
      onConfirm: (sel) => {
        setResult(
          `${sel.province.label} / ${sel.city.label} / ${sel.district.label}`,
        );
      },
    });
  };

  const openNoMaskClose = () => {
    showRegionPicker({
      maskClosable: false,
      title: "点击遮罩不关闭",
      onConfirm: (sel) => {
        setResult(
          `${sel.province.label} / ${sel.city.label} / ${sel.district.label}`,
        );
      },
    });
  };

  const openReactNodeTitle = () => {
    showRegionPicker({
      title: (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.08rem" }}>
          <span style={{ color: "#f59e0b" }}>★</span>
          <span>ReactNode 标题</span>
        </span>
      ),
      cancelText: <span style={{ color: "#ef4444" }}>✕ 关</span>,
      confirmText: <strong>OK ✓</strong>,
      onConfirm: (sel) => {
        setResult(
          `${sel.province.label} / ${sel.city.label} / ${sel.district.label}`,
        );
      },
    });
  };

  return (
    <div style={{ padding: "0.3rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
        <button onClick={openDefault}>默认（保留上次选择）</button>
        <button onClick={openWithInitial}>带初始值（广东/广州/天河）</button>
        <button onClick={openCustomTheme}>自定义主色（京东红）</button>
        <button onClick={openNoRounded}>无圆角</button>
        <button onClick={openCustomLabels}>自定义 tab 占位 / 按钮文案</button>
        <button onClick={openNoMaskClose}>点击遮罩不关闭</button>
        <button onClick={openReactNodeTitle}>ReactNode 标题/按钮</button>
      </div>
      <div style={{ marginTop: "0.4rem", fontSize: "0.3rem" }}>
        选择结果：
        <span style={{ color: "#2f7dff" }}>{result || "（未选择）"}</span>
      </div>
    </div>
  );
}
