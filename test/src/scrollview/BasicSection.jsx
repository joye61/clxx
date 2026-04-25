import { useRef, useState } from "react";
import { ScrollView } from "@";

export default function BasicSection() {
  const [list, setList] = useState(() =>
    Array.from({ length: 8 }, (_, i) => i + 1),
  );
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);
  const [stat, setStat] = useState({ scrollTop: 0, dir: "-" });

  const loadMore = () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    window.setTimeout(() => {
      setList((prev) => {
        const next = [...prev];
        const start = prev.length;
        for (let i = 1; i <= 8; i++) next.push(start + i);
        if (next.length >= 40) setHasMore(false);
        return next;
      });
      loadingRef.current = false;
    }, 700);
  };

  return (
    <div className="section">
      <div className="section-title">基础：触底加载更多 + 触顶事件</div>
      <div className="stat">
        scrollTop: {stat.scrollTop.toFixed(0)}px / 方向: {stat.dir} / 共{" "}
        {list.length} 项
        {!hasMore && <span className="badge">已全部加载</span>}
      </div>
      <div className="section-body" style={{ height: "4.4rem" }}>
        <ScrollView
          showLoading={hasMore}
          onScroll={(e) =>
            setStat({ scrollTop: e.scrollTop, dir: e.direction })
          }
          onReachTop={() => console.log("[basic] reach top")}
          onReachBottom={() => {
            console.log("[basic] reach bottom => loadMore");
            loadMore();
          }}
        >
          {list.map((n) => (
            <div className="item" key={n}>
              第 {n} 项 — 内容占位行
            </div>
          ))}
        </ScrollView>
      </div>
    </div>
  );
}
