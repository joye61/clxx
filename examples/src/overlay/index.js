import { Overlay, SafeArea } from "@";
import { useState } from "react";

export default function () {
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  return (
    <>
      <p>
        <button onClick={() => setShow1(true)}>Overlay显示在当前位置</button>
      </p>
      <p>
        <button onClick={() => setShow2(true)}>
          Overlay显示在外部（body下方）
        </button>
      </p>

      {show1 && (
        <Overlay onClick={() => setShow1(false)}>
          <div style={{ color: "#fff" }}>Overlay显示在虚拟DOM中插入的位置</div>
        </Overlay>
      )}
      {show2 && (
        <Overlay outside onClick={() => setShow2(false)}>
          <div style={{ color: "#fff" }}>Overlay显示在最外面，默认body下新创建的DOM中</div>
        </Overlay>
      )}
    </>
  );
}
