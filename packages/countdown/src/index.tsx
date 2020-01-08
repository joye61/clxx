/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffect, useRef, useState } from "react";
import React from "react";
import {
  StarterOption,
  updateCallback,
  updateResult,
  Starter
} from "./Starter";
import pick from "lodash/pick";
import omit from "lodash/omit";

export interface CountDownProps
  extends StarterOption,
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLSpanElement>,
      HTMLSpanElement
    > {
  // 没有单位，以分隔符分割
  noUnit?: boolean;
  // 分隔符
  separator?: string;
  // 渲染数字
  renderItem?: (item: updateResult) => React.ReactNode;
}

function useFrame(option: Partial<StarterOption>, update: updateCallback) {
  const updateRef = useRef<updateCallback>(update);
  updateRef.current = update;

  useEffect(() => {
    let update = updateRef.current;
    if (typeof option.onUpdate === "function") {
      update = (result: updateResult[]) => {
        option.onUpdate?.(result);
        updateRef.current(result);
      };
    }
    const countdown = new Starter(option);
    countdown.onUpdate(update);
    return () => countdown.destroy();
  }, []);
}

export function CountDown(props: Partial<CountDownProps>) {
  const {
    noUnit = true,
    separator = ":",
    renderItem,
    ...extraProps
  } = props;

  // starter 的启动参数
  const starterProps = [
    "remainTime",
    "interval",
    "format",
    "onUpdate",
    "onEnd",
    "unitMap",
    "startImmediately"
  ];

  // 提取starter的启动参数
  const starterOption: Partial<StarterOption> = pick(extraProps, starterProps);
  // 组件默认的启动参数
  const attributes = omit(extraProps, starterProps);

  // 初始化一个永远不会执行的定时器，主要用于获取初始值
  const initCountDown = new Starter({
    ...starterOption,
    startImmediately: false
  });

  const [result, setResult] = useState<Array<updateResult>>(
    initCountDown.getCurrentResult()
  );

  // 更新结果参数
  useFrame(starterOption, result => setResult([...result]));

  const output = result.map((item, index) => {
    let extra: React.ReactNode = null;
    if (noUnit) {
      extra = index === result.length - 1 ? "" : separator;
    } else {
      extra = item.unit;
    }

    /**
     * 可以定制渲染数字的UI
     */
    let showItem: React.ReactNode;
    if (typeof renderItem === "function") {
      showItem = renderItem(item);
    } else {
      showItem = (
        <span
          css={{
            fontFamily: "Arial, Verdana, Tahoma"
          }}
          className="cl-CountDown-num"
        >
          {item.text}
        </span>
      );
    }

    return (
      <React.Fragment key={index}>
        {showItem}
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
