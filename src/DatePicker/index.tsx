/** @jsx jsx */
import { jsx } from "@emotion/core";
import { FixContainer } from "../Layout/FixContainer";
import { RowBetween } from "../Layout/Row";
import { style } from "./style";
import { Clickable } from "../Clickable";
import { modeExist } from "./util";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { DatePickerProps, AnimationState } from "./types";
import { Year } from "./Year";
import { Month } from "./Month";
import { DateDay } from "./DateDay";
import { HIS } from "./HIS";
import { dpContext } from "./context";

export function DatePicker(props: DatePickerProps) {
  let {
    date = dayjs(),
    max = dayjs("2100-01-01"),
    min = dayjs("1900-01-01"),
    mode = "ymd",
    ...attributes
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
   * 动画效果
   */
  const [animate, setAnimate] = useState<AnimationState>({
    background: style.backgroundShow,
    container: style.containerUp
  });

  return (
    <dpContext.Provider value={{ value, setValue, min, max, mode }}>
      <FixContainer centerChild={false} css={animate.background}>
        <div css={[style.container, animate.container]} {...attributes}>
          <RowBetween css={style.btnGroup}>
            <Clickable css={style.btn} className="cancel">
              取消
            </Clickable>
            <Clickable css={style.btn} className="confirm">
              确定
            </Clickable>
          </RowBetween>
          <RowBetween>
            {mode.indexOf("y") >= 0 ? <Year /> : null}
            {mode.indexOf("m") >= 0 ? <Month /> : null}
            {mode.indexOf("d") >= 0 ? <DateDay /> : null}
            {mode.indexOf("h") >= 0 ? <HIS mode="h" /> : null}
            {mode.indexOf("i") >= 0 ? <HIS mode="i" /> : null}
            {mode.indexOf("s") >= 0 ? <HIS mode="s" /> : null}
          </RowBetween>
        </div>
      </FixContainer>
    </dpContext.Provider>
  );
}
