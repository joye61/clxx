import { useEffect, useRef, useState } from "react";
import { ScrollView } from "@";

export default function PerfSection() {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const list = Array.from({ length: 1000 }, (_, i) => i + 1);

  useEffect(() => {
    console.log("PerfSection mounted, 1000 items");
  }, []);

  return (
    <div className="section">
      <div className="section-title">大列表性能（1000 项 + RAF 节流）</div>
      <div className="stat">onScroll 触发次数: {count}</div>
      <div className="section-body" style={{ height: "4rem" }}>
        <ScrollView ref={ref} onScroll={() => setCount((c) => c + 1)}>
          {list.map((n) => (
            <div className="item" key={n}>
              性能行 {n}
            </div>
          ))}
        </ScrollView>
      </div>
      <div className="toolbar">
        <button onClick={() => ref.current?.scrollToTop("smooth")}>
          回顶部
        </button>
        <button onClick={() => setCount(0)}>重置计数</button>
      </div>
    </div>
  );
}
