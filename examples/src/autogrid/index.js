import "./index.scss";
import React from "react";
import { AutoGrid } from "@";

export default function Index() {
  return (
    <div>
      <p>简单测试</p>
      <AutoGrid cols={4} gap={".1rem"} isSquare itemStyle={{ background: "yellow" }}>
        <div style={{ width: "400px", backgroundColor: "red" }}>3143214112</div>
        {[<span key={1}>1</span>, <span key={2}>2</span>, <span key={3}>3</span>]}, . :<span>1</span>
        <span>2</span>
        <span>3</span>
        {false}
        {null}
        {undefined}
        {0}
        {[]}
        {""}
        {true}
        {() => <>123</>}
        <p>最后一个</p>
      </AutoGrid>
    </div>
  );
}
