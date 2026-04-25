import { useRef } from "react";
import { ScrollView } from "@";

export default function ImperativeSection() {
  const ref = useRef(null);
  const list = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="section">
      <div className="section-title">命令式 API（forwardRef + handle）</div>
      <div className="section-body" style={{ height: "4rem" }}>
        <ScrollView ref={ref}>
          {list.map((n) => (
            <div
              className={"item" + (n === 18 ? " target" : "")}
              key={n}
              data-index={n}
            >
              Item #{n}
              {n === 18 && " ← 目标项"}
            </div>
          ))}
        </ScrollView>
      </div>
      <div className="toolbar">
        <button onClick={() => ref.current?.scrollToTop("smooth")}>
          ↑ 顶部
        </button>
        <button onClick={() => ref.current?.scrollToBottom("smooth")}>
          ↓ 底部
        </button>
        <button onClick={() => ref.current?.scrollTo({ top: 200 })}>
          跳到 200px
        </button>
        <button
          onClick={() =>
            ref.current?.scrollToElement('[data-index="18"]', {
              behavior: "smooth",
              offset: -20,
            })
          }
        >
          滚到目标项
        </button>
        <button
          onClick={() => {
            const el = ref.current?.getElement();
            console.log("getElement →", el);
          }}
        >
          打印 DOM
        </button>
      </div>
    </div>
  );
}
