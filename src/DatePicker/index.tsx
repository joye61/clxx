/** @jsx jsx */
import { jsx } from "@emotion/core";
import { FixContainer } from "../Layout/FixContainer";
import { RowBetween, RowCenter } from "../Layout/Row";
import { style } from "./style";
import { Clickable } from "../Clickable";
import { prefix0, modeExist } from "./util";
import { useState } from "react";
import dayjs from "dayjs";
import {
  DateInfo,
  DatePickerProps,
  AnimationState,
  DatePickerConfig
} from "./types";
import { Year } from "./Year";
import { Month } from "./Month";
import { DDate } from "./Date";
import { HIS } from "./HIS";

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
   * 当前选择器的配置
   */
  const config: DatePickerConfig = { max, min, mode };

  /**
   * 初始化时间信息
   */
  const [dateInfo, setDateInfo] = useState<DateInfo>({
    current: dayjs(date)
  });

  /**
   * 动画效果
   */
  const [animate, setAnimate] = useState<AnimationState>({
    background: style.backgroundShow,
    container: style.containerUp
  });

  const monthList: React.ReactNode[] = [];
  const dateList: React.ReactNode[] = [];

  for (let i = 1; i <= 12; i++) {
    monthList.push(
      <RowCenter css={style.item} key={i}>
        {prefix0(i)}
        <span css={style.unit}>月</span>
      </RowCenter>
    );
  }
  for (let i = 1; i <= 31; i++) {
    dateList.push(
      <RowCenter css={style.item} key={i}>
        {prefix0(i)}
        <span css={style.unit}>日</span>
      </RowCenter>
    );
  }

  return (
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
          {config.mode.indexOf("y") >= 0 ? (
            <Year
              config={config}
              dateInfo={dateInfo}
              setDateInfo={setDateInfo}
            />
          ) : null}
          {config.mode.indexOf("m") >= 0 ? (
            <Month
              config={config}
              dateInfo={dateInfo}
              setDateInfo={setDateInfo}
            />
          ) : null}
          {config.mode.indexOf("d") >= 0 ? (
            <DDate
              config={config}
              dateInfo={dateInfo}
              setDateInfo={setDateInfo}
            />
          ) : null}
          {config.mode.indexOf("h") >= 0 ? (
            <HIS
              config={config}
              dateInfo={dateInfo}
              setDateInfo={setDateInfo}
              mode="h"
            />
          ) : null}
          {config.mode.indexOf("i") >= 0 ? (
            <HIS
              config={config}
              dateInfo={dateInfo}
              setDateInfo={setDateInfo}
              mode="i"
            />
          ) : null}
          {config.mode.indexOf("s") >= 0 ? (
            <HIS
              config={config}
              dateInfo={dateInfo}
              setDateInfo={setDateInfo}
              mode="s"
            />
          ) : null}
        </RowBetween>
      </div>
    </FixContainer>
  );
}
