/** @jsx jsx */
import React, { useEffect, useState } from "react";
import { Interpolation, jsx, Theme } from "@emotion/react";
import {
  Countdown,
  CountdownOption,
  CountdownValue,
  CountdownValueIndex,
} from "../utils/Countdown";
import { RowStart } from "../Flex/Row";

export interface CountdownerOption
  extends CountdownOption,
    React.HTMLProps<HTMLDivElement> {
  // 数字之间的分隔符
  seperator?: React.ReactNode;
  // 分隔符之间的样式
  seperatorStyle?: Interpolation<Theme>;
  // 包裹容器的样式
  containerStyle?: Interpolation<Theme>;
  // 数字的样式
  numberStyle?: Interpolation<Theme>;
  // 数字的渲染组件
  renderNumber?: (value: number, key?: string) => React.ReactNode;
  // 渲染分隔符
  renderSeperator?: (value: number, key?: string) => React.ReactNode;
}

export function Countdowner(props: CountdownerOption) {
  let {
    remain = 0,
    seperator = ":",
    format = "his",
    onUpdate,
    onEnd,
    seperatorStyle,
    containerStyle,
    numberStyle,
    renderNumber,
    renderSeperator,
    ...extra
  } = props;

  const [value, setValue] = useState<CountdownValue | null>(null);

  let content: Array<React.ReactNode> = [];
  if (value && typeof value === "object") {
    for (let i = 0; i < format.length; i++) {
      // 渲染数字进组件
      const key = format[i] as CountdownValueIndex;
      const num = value![key]!;
      let numberComponent: React.ReactNode;
      if (typeof renderNumber === "function") {
        numberComponent = renderNumber(num, key);
      } else {
        // 默认以span包围，且数字不足10的时候有前置0
        numberComponent = (
          <span css={numberStyle}>{num < 10 ? `0${num}` : num}</span>
        );
      }
      content.push(<React.Fragment key={i}>{numberComponent}</React.Fragment>);

      // 添加分隔符，最后一个数字不需要分隔符
      if (i !== format.length - 1) {
        let seperatorComponent: React.ReactNode;
        if (typeof renderSeperator === "function") {
          seperatorComponent = renderSeperator(num, key);
        } else {
          seperatorComponent = seperator ? (
            <span css={seperatorStyle}>{seperator}</span>
          ) : null;
        }
        content.push(
          <React.Fragment key={`s${i}`}>{seperatorComponent}</React.Fragment>
        );
      }
    }
  }

  useEffect(() => {
    let instance: Countdown | null = new Countdown({
      format,
      remain,
      onUpdate(current) {
        setValue(current);
        onUpdate?.(current);
      },
      onEnd() {
        onEnd?.();
      },
    });
    instance.start();

    // 执行清理逻辑
    return () => {
      instance!.stop();
      instance = null;
    };
  }, [format, remain]);

  return (
    <RowStart {...extra} css={containerStyle}>
      {content}
    </RowStart>
  );
}
