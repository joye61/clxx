/** @jsx jsx */
import { jsx } from "@emotion/core";
import { CountDownOption, CountDowner, updateResult, updateCallback } from ".";
import { useEffect, useRef, useState } from "react";
import React from "react";

export interface CountDownProps
  extends CountDownOption,
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLSpanElement>,
      HTMLSpanElement
    > {
  // 没有单位，以分隔符分割
  noUnit?: boolean;
  // 分隔符
  separator?: string;
}

function useFrame(option: CountDownOption, update: updateCallback) {
  const updateRef = useRef<updateCallback>(update);
  useEffect(() => {
    updateRef.current = update;
  });

  useEffect(() => {
    let update = updateRef.current;
    if (typeof option.onUpdate === "function") {
      update = (result: updateResult[]) => {
        option.onUpdate(result);
        updateRef.current(result);
      };
    }
    const countdown = new CountDowner(option);
    countdown.onUpdate(update);
    return () => countdown.destroy();
  }, [option]);
}

export function CountDown(props: CountDownProps) {
  const {
    noUnit = true,
    separator = ":",
    remainTime,
    interval,
    format, // 默认输出时分秒
    unitMap,
    onUpdate,
    onEnd,
    startImmediately,
    ...attributes
  } = props;

  // 初始化一个永远不会执行的定时器，主要用于获取初始值
  const initCountDown = new CountDowner({
    remainTime,
    interval,
    format,
    unitMap,
    onUpdate,
    onEnd,
    startImmediately: false
  });

  const [result, setResult] = useState<Array<updateResult>>(
    initCountDown.getCurrentResult()
  );

  // 更新结果参数
  useFrame(props, result => setResult([...result]));

  const output = result.map((item, index) => {
    let extra: React.ReactNode = null;
    if (noUnit) {
      extra = index === result.length - 1 ? "" : separator;
    } else {
      extra = item.unit;
    }
    return (
      <React.Fragment key={index}>
        <span
          css={{
            fontFamily: "Arial, Verdana, Tahoma"
          }}
          className="cl-CountDown-num"
        >
          {item.text}
        </span>
        {extra}
      </React.Fragment>
    );
  });

  return (
    <span {...attributes} className="cl-CountDown">
      {output}
    </span>
  );
}
