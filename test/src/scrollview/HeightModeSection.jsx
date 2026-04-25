import { ScrollView } from "@";

export default function HeightModeSection() {
  return (
    <div className="section">
      <div className="section-title">两种高度方式：prop height vs CSS</div>
      <div className="section-body">
        <div style={{ display: "flex", gap: "0.16rem", padding: "0.16rem" }}>
          <div style={{ flex: 1, border: "1px solid #eee" }}>
            <div className="stat">prop height="2.4rem"</div>
            <ScrollView height="2.4rem">
              {Array.from({ length: 12 }, (_, i) => (
                <div className="item" key={i}>
                  A{i + 1}
                </div>
              ))}
            </ScrollView>
          </div>
          <div
            style={{
              flex: 1,
              border: "1px solid #eee",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="stat">外层 flex 高 2.4rem</div>
            <div style={{ height: "2.4rem" }}>
              <ScrollView>
                {Array.from({ length: 12 }, (_, i) => (
                  <div className="item" key={i}>
                    B{i + 1}
                  </div>
                ))}
              </ScrollView>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
