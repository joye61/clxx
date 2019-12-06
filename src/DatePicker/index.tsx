/** @jsx jsx */
import { jsx, SerializedStyles } from "@emotion/core";
import { FixContainer } from "../Layout/FixContainer";
import { ScrollSnap } from "../ReactSwiper/ScrollSnap";
import { RowBetween, RowCenter } from "../Layout/Row";
import { style } from "./style";
import { Clickable } from "../Clickable";
import { Extra } from "./Extra";
import { prefix0 } from "./util";
import { useState } from "react";
import dayjs, { ConfigType, Dayjs } from "dayjs";

interface AnimationState {
  background: SerializedStyles;
  container: SerializedStyles;
}

interface DatePickerProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  /**
   * 一个dayjs可以解析的合法值，如果没有传递，则默认取当前时间
   */
  date?: ConfigType;
  /**
   * 选择器可以选择的最大时间值，默认最大值为2100/01/01
   */
  max?: ConfigType;
  /**
   * 选择器可以选择的最小时间值，默认最小值为1900/01/01
   */
  min?: ConfigType;
  /**
   * 选择器模式ymdhis，不区分大小写，默认ymd，必须按照顺序出现
   * 错误：Yd，中间缺少m
   * 错误：ya，a不存在
   * 六个字母代表
   * y：年
   * m：月
   * d：日
   * h：时
   * i：分
   * s：秒
   */
  mode?: string;
}

export function DatePicker(props: DatePickerProps) {
  const {
    date = dayjs(),
    max = dayjs("2100-01-01"),
    min = dayjs("1900-01-01"),
    mode = "ymd",
    ...attributes
  } = props;

  /**
   * 初始化时间信息
   */
  const [currentDate, setCurrentDate] = useState<ConfigType>(date);

  const [animate, setAnimate] = useState<AnimationState>({
    background: style.backgroundShow,
    container: style.containerUp
  });

  const yearList: React.ReactNode[] = [];
  const monthList: React.ReactNode[] = [];
  const dateList: React.ReactNode[] = [];
  for (let i = 1900; i <= 2100; i++) {
    yearList.push(
      <RowCenter css={style.item} key={i}>
        {i}
        <span css={style.unit}>年</span>
      </RowCenter>
    );
  }
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
          <ScrollSnap
            extra={<Extra />}
            css={style.swiperContainer}
            swiperOption={{
              on: {
                slideChangeTransitionEnd() {
                  console.log("slideChangeTransitionEnd");
                },
                slideChange() {
                  console.log("slideChange");
                }
              }
            }}
          >
            {yearList}
          </ScrollSnap>
          <ScrollSnap extra={<Extra />} css={style.swiperContainer}>
            {monthList}
          </ScrollSnap>
          <ScrollSnap extra={<Extra />} css={style.swiperContainer}>
            {dateList}
          </ScrollSnap>
        </RowBetween>
      </div>
    </FixContainer>
  );
}
