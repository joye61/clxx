import React, { useEffect, useState } from 'react';
import { Interpolation, Theme } from '@emotion/react';
import {
  Countdown,
  CountdownOption,
  CountdownValue,
  CountdownValueIndex,
} from '../utils/Countdown';
import { RowStart } from '../Flex/Row';

export interface CountdownerOption
  extends CountdownOption,
    React.HTMLProps<HTMLDivElement> {
  // 数字之间的分隔符
  separator?: React.ReactNode;
  // 分隔符的样式
  separatorStyle?: Interpolation<Theme>;
  // 包裹容器的样式
  containerStyle?: Interpolation<Theme>;
  // 数字的样式
  numberStyle?: Interpolation<Theme>;
  // 数字的渲染组件
  renderNumber?: (value: number, key?: string) => React.ReactNode;
  // 渲染分隔符
  renderSeparator?: (value: number, key?: string) => React.ReactNode;
}

export function Countdowner(props: CountdownerOption) {
  let {
    remain = 0,
    separator = ':',
    format = 'his',
    onUpdate,
    onEnd,
    separatorStyle,
    containerStyle,
    numberStyle,
    renderNumber,
    renderSeparator,
    ...extra
  } = props;

  const [value, setValue] = useState<CountdownValue | null>(null);

  // 使用 ref 保存最新的回调，避免频繁重建倒计时实例
  const callbacksRef = React.useRef({ onUpdate, onEnd });
  callbacksRef.current = { onUpdate, onEnd };

  let content: Array<React.ReactNode> = [];
  if (value && typeof value === 'object') {
    for (let i = 0; i < format.length; i++) {
      // 渲染数字进组件
      const key = format[i] as CountdownValueIndex;
      const num = value![key]!;
      let numberComponent: React.ReactNode;
      if (typeof renderNumber === 'function') {
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
        let separatorComponent: React.ReactNode;
        if (typeof renderSeparator === 'function') {
          separatorComponent = renderSeparator(num, key);
        } else {
          separatorComponent = separator ? (
            <span css={separatorStyle}>{separator}</span>
          ) : null;
        }
        content.push(
          <React.Fragment key={`s${i}`}>{separatorComponent}</React.Fragment>
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
        // 使用 ref 中的最新回调
        callbacksRef.current.onUpdate?.(current);
      },
      onEnd() {
        // 使用 ref 中的最新回调
        callbacksRef.current.onEnd?.();
      },
    });
    instance.start();

    // 执行清理逻辑
    return () => {
      instance!.stop();
      instance = null;
    };
  }, [format, remain]);  // ← 移除 onUpdate 和 onEnd 依赖

  return (
    <RowStart {...extra} css={containerStyle}>
      {content}
    </RowStart>
  );
}
