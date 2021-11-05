import React from "react";
import { Ago } from "@";

export default function Index() {
  return (
    <div>
      <p>2019-11-2</p>
      <Ago date="2019-11-2" style={{ color: "red" }} />
      <hr />
      <p>2020-06-02</p>
      <Ago date="2020-6-2" style={{ color: "red" }} />
      <hr />
      <p>2018/06/02</p>
      <Ago date="2018/06/02" style={{ color: "red" }} />
      <hr />
      <p>2018/07/06 12:04:36</p>
      <Ago date="2018/07/06 12:04:36" style={{ color: "red" }} />
      <hr />
      <p>Date.now()</p>
      <Ago date={Date.now()} style={{ color: "red" }} />
      <hr />
      <p>new Date("2012-07-16 12:30:06")</p>
      <Ago date={new Date("2012-07-16 12:30:06")} style={{ color: "red" }} />
      <hr />
      <p>(时间戳：毫秒)1583314718595</p>
      <Ago date={1583314718595} style={{ color: "red" }} />
      <hr />
    </div>
  );
}
