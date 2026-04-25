import { useState } from "react";
import { ScrollView } from "@";

export default function CustomLoadingSection() {
  const [list, setList] = useState(() =>
    Array.from({ length: 5 }, (_, i) => i + 1),
  );
  const [loading, setLoading] = useState(false);

  const onReachBottom = () => {
    if (loading) return;
    setLoading(true);
    window.setTimeout(() => {
      setList((prev) => [
        ...prev,
        ...Array.from({ length: 5 }, (_, i) => prev.length + i + 1),
      ]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="section">
      <div className="section-title">
        自定义 loading 内容 + 触底阈值 100px
      </div>
      <div className="section-body" style={{ height: "4rem" }}>
        <ScrollView
          reachBottomThreshold={100}
          onReachBottom={onReachBottom}
          loadingContent={
            <div
              style={{
                padding: "0.2rem",
                textAlign: "center",
                fontSize: "0.24rem",
                color: loading ? "#2f7dff" : "#8e8e93",
              }}
            >
              {loading ? "正在加载…" : "上拉加载更多"}
            </div>
          }
        >
          {list.map((n) => (
            <div className="item" key={n}>
              卡片 {n}
            </div>
          ))}
        </ScrollView>
      </div>
    </div>
  );
}
