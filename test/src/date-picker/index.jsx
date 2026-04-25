import { showDatePicker } from "@";
import { useState } from "react";

export default function DatePickerDemo() {
  const [result, setResult] = useState("");

  const open = (precision) => {
    showDatePicker({
      precision,
      title: `选择日期（${precision}）`,
      onConfirm: (d) => {
        const fmt =
          precision === "day"
            ? "YYYY-MM-DD"
            : precision === "hour"
              ? "YYYY-MM-DD HH时"
              : precision === "minute"
                ? "YYYY-MM-DD HH:mm"
                : "YYYY-MM-DD HH:mm:ss";
        setResult(d.format(fmt));
      },
      onCancel: () => {
        console.log("取消选择");
      },
    });
  };

  return (
    <div style={{ padding: "0.3rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
        <button onClick={() => open("day")}>选择年/月/日</button>
        <button onClick={() => open("hour")}>选择年/月/日 + 时</button>
        <button onClick={() => open("minute")}>选择年/月/日 + 时分</button>
        <button onClick={() => open("second")}>选择年/月/日 + 时分秒</button>
        <button
          onClick={() => {
            showDatePicker({
              precision: "minute",
              value: "2024-06-15 10:30",
              primary: "#16a34a",
              minDate: "2024-01-01",
              maxDate: "2026-12-31 23:59",
              title: "自定义范围 + 绿色主题",
              onConfirm: (d) => {
                setResult(d.format("YYYY-MM-DD HH:mm"));
              },
            });
          }}
        >
          自定义初值 / 范围 / 主题
        </button>
        <button
          onClick={() => {
            showDatePicker({
              precision: "minute",
              showUnit: false,
              title: "不显示单位",
              onConfirm: (d) => setResult(d.format("YYYY-MM-DD HH:mm")),
            });
          }}
        >
          不显示单位
        </button>
        <button
          onClick={() => {
            showDatePicker({
              precision: "second",
              units: {
                year: "Y",
                month: "M",
                day: "D",
                hour: "h",
                minute: "m",
                second: "s",
              },
              title: "英文单位",
              onConfirm: (d) => setResult(d.format("YYYY-MM-DD HH:mm:ss")),
            });
          }}
        >
          自定义单位（英文）
        </button>
        <button
          onClick={() => {
            showDatePicker({
              precision: "day",
              rounded: false,
              title: "无圆角（rounded=false）",
              onConfirm: (d) => setResult(d.format("YYYY-MM-DD")),
            });
          }}
        >
          无圆角
        </button>
        <button
          onClick={() => {
            showDatePicker({
              precision: "day",
              title: (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.08rem" }}>
                  <span style={{ color: "#ef4444" }}>★</span>
                  <span>ReactNode 标题</span>
                </span>
              ),
              cancelText: <span style={{ color: "#ef4444" }}>✕ 关</span>,
              confirmText: <strong>OK ✓</strong>,
              onConfirm: (d) => setResult(d.format("YYYY-MM-DD")),
            });
          }}
        >
          ReactNode 标题/按钮文案
        </button>
      </div>
      <div style={{ marginTop: "0.4rem", fontSize: "0.3rem" }}>
        选择结果：<span style={{ color: "#2f7dff" }}>{result || "（未选择）"}</span>
      </div>
    </div>
  );
}
