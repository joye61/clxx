/** @jsx jsx */
import { jsx } from "@emotion/react";
import dayjs from "dayjs";
import { ago, AgoValue } from "../utils/ago";

export interface AgoProps
  extends React.HTMLProps<HTMLSpanElement | HTMLDivElement> {
    
  // 将要格式化显示的日期，任意的dayjs识别的格式
  date?: dayjs.ConfigType;
  // 是否显示为块div，默认为span
  block?: boolean;
  // 定制内容
  renderContent?: (result: AgoValue) => React.ReactNode;
}

export function Ago(props: AgoProps) {
  const { date = dayjs(), block = false, renderContent, ...attrs } = props;
  const agoValue = ago(date);

  // 格式化内容
  let content: string | React.ReactNode = agoValue.format;
  if (typeof renderContent === "function") {
    content = renderContent(agoValue);
  }

  // 是否显示为块元素
  if (block) {
    return <div {...(attrs as React.HTMLProps<HTMLDivElement>)}>{content}</div>;
  }

  // 默认显示行内元素
  return <span {...attrs}>{content}</span>;
}
