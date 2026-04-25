import { useState } from "react";
import { ScrollView } from "@";

export default function NotScrollableSection() {
  const [items, setItems] = useState([1, 2]);
  return (
    <div className="section">
      <div className="section-title">
        内容不足时自动隐藏 loading（点击按钮加内容观察 loading 出现）
      </div>
      <div className="section-body" style={{ height: "3rem" }}>
        <ScrollView showLoading>
          {items.map((n) => (
            <div className="item" key={n}>
              Row {n}
            </div>
          ))}
        </ScrollView>
      </div>
      <div className="toolbar">
        <button
          onClick={() =>
            setItems((prev) => [...prev, prev.length + 1, prev.length + 2])
          }
        >
          + 加 2 行
        </button>
        <button onClick={() => setItems([1, 2])}>重置</button>
      </div>
    </div>
  );
}
