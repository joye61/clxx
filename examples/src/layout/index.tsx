import "./index.scss";
import React, { useState, useEffect } from "react";
import { Grid } from "../../../packages/layout/build/Grid";

export default function() {
  const [list, setList] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setList([
        <p className="LGCell">测试1</p>,
        <p className="LGCell">测试2</p>,
        <p className="LGCell">测试3</p>,
        <p className="LGCell">测试4</p>
      ]);
    }, 2000);
  }, []);

  return (
    <div>
      <h1>网格布局组件Grid</h1>

      <div>
        <p className="LayoutGridTitle">
          2列（默认），空白0（默认），元素高度自适应
        </p>
        <Grid>
          <div>这是一个表格单元</div>
          <div>这是一个表格单元</div>
          <div>这是一个表格单元</div>
          <div>这是一个表格单元</div>
          <p>你好你好你好你好你好你好你好你好</p>
          <p>测试</p>
        </Grid>
      </div>
      <div>
        <p className="LayoutGridTitle">
          2列，空白0.05rem，方形单元格，空白环绕
        </p>
        <Grid gap="0.05rem" square className="LGWithBorder">
          <div className="LGCell">这是一个表格单元</div>
          <div className="LGCell">这是一个表格单元</div>
          <div className="LGCell">这是一个表格单元</div>
          <div className="LGCell">这是一个表格单元</div>
          <p className="LGCell">你好你好你好你好你好你好你好你好</p>
          <p className="LGCell">测试</p>
        </Grid>
      </div>
      <div>
        <p className="LayoutGridTitle">
          2列，空白0.05rem，方形单元格，没有空白环绕
        </p>
        <Grid gap="0.05rem" square gapSurround={false} className="LGWithBorder">
          <div className="LGCell">这是一个表格单元</div>
          <div className="LGCell">这是一个表格单元</div>
          <div className="LGCell">这是一个表格单元</div>
          <div className="LGCell">这是一个表格单元</div>
          <p className="LGCell">你好你好你好你好你好你好你好你好</p>
          <p className="LGCell">测试</p>
        </Grid>
      </div>
      <div>
        <p className="LayoutGridTitle">
          3列，空白0.05rem，自动高度，没有空白环绕
        </p>
        <Grid column={3} gap="0.05rem" gapSurround={false}>
          <div className="LGCell">这是一个表格单元</div>
          <div className="LGCell">这是一个表格单元</div>
          <div className="LGCell">这是一个表格单元</div>
          <div className="LGCell">这是一个表格单元</div>
          <p className="LGCell">你好你好你好你好你好你好你好你好</p>
          <p className="LGCell">测试</p>
        </Grid>
      </div>
      <div>
        <p className="LayoutGridTitle">
          3列，空白0.05rem，自动高度，没有空白环绕，动态增加
        </p>
        <Grid column={3} gap="0.05rem" gapSurround={false}>
          <div className="LGCell">这是一个表格单元</div>
          <div className="LGCell">这是一个表格单元</div>
          <div className="LGCell">这是一个表格单元</div>
          <div className="LGCell">这是一个表格单元</div>
          <p className="LGCell">你好你好你好你好你好你好你好你好</p>
          <p className="LGCell">测试</p>
          {list}
        </Grid>
      </div>
    </div>
  );
}
