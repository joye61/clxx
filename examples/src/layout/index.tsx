import React, { useState, useEffect } from "react";
import { Grid } from "../../../packages/layout/build/Grid";

export default function() {
  const [list, setList] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setList([<p>测试1</p>, <p>测试2</p>, <p>测试3</p>, <p>测试4</p>]);
    }, 2000);
  }, []);

  return (
    <div>
      <Grid
        column={3}
        gap="0.05rem"
        square
        style={{ border: "1px solid #ccc" }}
      >
        hello world
        <p>你好你好你好你好你好你好你好你好</p>
        <p>测试</p>
        {list}
      </Grid>
    </div>
  );
}
