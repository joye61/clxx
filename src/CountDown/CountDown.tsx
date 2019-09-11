/** @jsx jsx */
import { jsx, InterpolationWithTheme } from "@emotion/core";
import { CountDownOption } from ".";

export interface CountDownProps extends CountDownOption{
  // 没有单位，以分隔符分割
  noUnit?: boolean;
  // 分隔符
  separator?: string;
  // 单位映射
  unitMap?: {
    y?: string;
    m?: string;
    d?: string;
    h?: string;
    i?: string;
    s?: string;
  };
}

export function CountDown(props: CountDownProps){

}