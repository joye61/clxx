import { SerializedStyles } from "@emotion/core";
import { ConfigType, Dayjs } from "dayjs";
import { SetStateAction } from "react";

export interface AnimationState {
  background: SerializedStyles;
  container: SerializedStyles;
}

export interface DatePickerProps
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

/**
 * 选择器的配置
 */
export interface DatePickerConfig {
  max: ConfigType;
  min: ConfigType;
  mode: string;
}

export interface DateInfo {
  current: Dayjs;
}

export interface DateItemProps {
  config: DatePickerConfig;
  dateInfo: DateInfo;
  setDateInfo: React.Dispatch<SetStateAction<DateInfo>>;
}
