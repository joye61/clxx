/** @jsx jsx */
import { jsx } from "@emotion/core";
import { FixContainer } from "../Layout/FixContainer";
import { RowBetween } from "../Layout/Row";
import { style, backgroundHide } from "./style";
import { Clickable } from "../Clickable";
import { modeExist } from "./util";
import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { DatePickerProps, AnimationState } from "./types";
import { Year } from "./Year";
import { Month } from "./Month";
import { DateDay } from "./DateDay";
import { HIS } from "./HIS";
import { dpContext } from "./context";

export function Dialog(props: DatePickerProps) {
  let {
    date = dayjs(),
    max = dayjs("2100-01-01"),
    min = dayjs("1900-01-01"),
    mode = "ymd",
    onCancel,
    onConfirm,
    onHide
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

  const cancel = () => {
    setAnimate({
      background: style.backgroundHide,
      container: style.containerDown
    });
    typeof onCancel === "function" && onCancel();
  };
  const confirm = () => {
    setAnimate({
      background: style.backgroundHide,
      container: style.containerDown
    });
    typeof onConfirm === "function" && onConfirm(value);
  };

  const onAnimationEnd = (event: React.AnimationEvent) => {
    if (event.animationName === backgroundHide.name) {
      typeof onHide === "function" && onHide();
    }
  };

  return (
    <dpContext.Provider value={{ value, setValue, min, max, mode }}>
      <FixContainer
        centerChild={false}
        css={animate.background}
        onAnimationEnd={onAnimationEnd}
      >
        <div css={[style.container, animate.container]}>
          <RowBetween css={style.btnGroup}>
            <Clickable css={style.btn} className="cancel" onClick={cancel}>
              取消
            </Clickable>
            <Clickable css={style.btn} className="confirm" onClick={confirm}>
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
