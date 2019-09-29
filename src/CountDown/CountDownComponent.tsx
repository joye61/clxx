/** @jsx jsx */
import { jsx, InterpolationWithTheme } from "@emotion/core";
import { CountDownOption, CountDown, updateResult, updateCallback } from ".";
import { useEffect, useRef, useState } from "react";
import { is } from "../is";
import React from "react";

export interface CountDownComponentProps extends CountDownOption {
  // 没有单位，以分隔符分割
  noUnit?: boolean;
  // 分隔符
  separator?: string;
  // 容器样式
  className?: string;
  // 数字样式，数字默认是等宽字体
  numberStyle?: React.CSSProperties;
}

function useFrame(option: CountDownOption, update: updateCallback) {
  const updateRef = useRef<updateCallback>(update);
  useEffect(() => {
    updateRef.current = update;
  });

  useEffect(() => {
    let update = updateRef.current;
    if(is.function(option.onUpdate)) {
      update = (result: updateResult[])=>{
        option.onUpdate(result);
        updateRef.current(result);
      }
    }
    const countdown = new CountDown(option);
    countdown.onUpdate(update);
    return () => countdown.destroy();
  }, [option]);
}

export function CountDownComponent(props: CountDownComponentProps) {
  const noUnit = is.boolean(props.noUnit) ? props.noUnit : true;
  const separator = props.separator || ":";
  const className = is.string(props.className) ? props.className : undefined;

  // 初始化一个永远不会执行的定时器，主要用于获取初始值
  const initOption: CountDownOption = { ...props, startImmediately: false };
  const initCountDown = new CountDown(initOption);

  const [result, setResult] = useState<Array<updateResult>>(
    initCountDown.getCurrentResult()
  );

  // 更新结果参数
  useFrame(props, result => setResult([...result]));

  let numberStyle: InterpolationWithTheme<any> = {
    fontFamily: "Arial, Verdana, Tahoma"
  };
  if (is.plainObject(props.numberStyle)) {
    numberStyle = { ...numberStyle, ...props.numberStyle };
  }

  const output = result.map((item, index) => {
    let extra: React.ReactNode = null;
    if (noUnit) {
      extra = index === result.length - 1 ? "" : separator;
    } else {
      extra = item.unit;
    }
    return (
      <React.Fragment key={index}>
        <span css={numberStyle}>{item.text}</span>
        {extra}
      </React.Fragment>
    );
  });

  return <span className={className}>{output}</span>;
}
