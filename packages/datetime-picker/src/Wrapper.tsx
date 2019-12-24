/** @jsx jsx */
import { jsx } from "@emotion/core";
import { RowBetween, ColCenter } from "@clxx/layout";
import { style } from "./style";
import { modeExist, formatResult } from "./util";
import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { WrapperProps } from "./types";
import { Year } from "./Year";
import { Month } from "./Month";
import { Day } from "./Day";
import { HIS } from "./HIS";
import { dpContext } from "./context";
import { Controls } from "@clxx/picker/build/Controls";

export function Wrapper(props: WrapperProps) {
  let {
    date = dayjs(),
    max = "2100-01-01",
    min = "1900-01-01",
    mode = "ymd",
    onCancel,
    onConfirm,
    onChange,
    ...ControlsProps
  } = props;

  /**
   * 选择器模式必须满足：
   * 1、顺序正确
   * 2、键存在
   */
  if (!mode || typeof mode !== "string" || !modeExist(mode)) {
    mode = "ymd";
  } else {
    mode = mode.toLowerCase();
  }

  /**
   * 当前选择器的值
   */
  const [value, setValue] = useState<Dayjs>(dayjs(date));

  /**
   * 每次选择器得值变化，都会触发选择器的值发生更新
   */
  useEffect(() => {
    onChange?.(value);
  }, [value]);

  return (
    <dpContext.Provider
      value={{ value, setValue, min: dayjs(min), max: dayjs(max), mode }}
    >
      <div css={style.container}>
        <Controls
          {...ControlsProps}
          onCancel={() => {
            onCancel?.();
          }}
          onConfirm={() => {
            onConfirm?.(value);
          }}
        >
          <ColCenter css={style.resultBox}>
            <div css={style.hint}>当前选择</div>
            <div css={style.result}>{formatResult(mode, value)}</div>
          </ColCenter>
        </Controls>
        <RowBetween css={style.colGroup}>
          {mode.indexOf("y") >= 0 ? <Year /> : null}
          {mode.indexOf("m") >= 0 ? <Month /> : null}
          {mode.indexOf("d") >= 0 ? <Day /> : null}
          {mode.indexOf("h") >= 0 ? <HIS mode="h" /> : null}
          {mode.indexOf("i") >= 0 ? <HIS mode="i" /> : null}
          {mode.indexOf("s") >= 0 ? <HIS mode="s" /> : null}
        </RowBetween>
      </div>
    </dpContext.Provider>
  );
}
