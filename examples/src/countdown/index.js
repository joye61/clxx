import React, { useEffect, useState } from "react";
import { Countdown, Countdowner } from "@";

export default function Index () {
  const [show1, setShow1] = useState("");
  const [show2, setShow2] = useState("");
  const [show2Closed, setShow2Close] = useState(false);
  const [show3, setShow3] = useState("");

  useEffect(() => {
    const cd1 = new Countdown({
      remain: 1000,
      format: "his",
      onUpdate(result) {
        setShow1(() => `${result.h}时${result.i}分${result.s}秒`);
      },
    });
    cd1.start();

    const cd2 = new Countdown({
      remain: 10,
      format: "s",
      onUpdate(result) {
        setShow2(() => `${result.s}秒`);
      },
      onEnd() {
        setShow2Close(() => true);
      },
    });
    cd2.start();

    const cd3 = new Countdown({
      remain: 259205,
      format: "dhis",
      onUpdate(result) {
        setShow3(() => `${result.d}天${result.h}时${result.i}分${result.s}秒`);
      },
    });
    cd3.start();

    return () => {
      cd1.stop();
      cd2.stop();
      cd3.stop();
    };
  }, []);

  return (
    <div>
      <p>格式：his，总时长：1000秒</p>
      <p style={{ color: "red" }}>{show1}</p>
      <p>格式：s，总时长：10秒</p>
      <p style={{ color: "red" }}>
        {show2Closed ? (
          <span style={{ color: "green" }}> 已触发结束事件</span>
        ) : (
          show2
        )}
      </p>
      <p>格式：dhis，总时长：259200秒</p>
      <p style={{ color: "red" }}>{show3}</p>
      <hr />
      <p>下面是来自Countdowner组件的</p>
      <Countdowner remain={100}/>
      <Countdowner
        remain={1234}
        seperator="@"
        seperatorStyle={{
          transform: `rotate(45deg)`
        }}
        renderNumber={(n, key) => {
          if (key === "i") {
            return <strong>{n}</strong>;
          } else {
            return <span>{n}</span>;
          }
        }}
      />
      <Countdowner
        remain={1234}
        seperator="@"
        renderSeperator={(key)=>{
          return <span style={{border: `1px solid red`}}>{key}</span> 
        }}
      />
      <Countdowner
        remain={10}
        containerStyle={{
          background: "rgba(0,0,0,.2)"
        }}
        onEnd={()=>{console.log("已结束");}}
      />
    </div>
  );
}
