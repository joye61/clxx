/** @jsx jsx */
import { jsx, SerializedStyles, InterpolationWithTheme } from '@emotion/core';
import * as CSS from 'csstype';
import { useRef, useState } from 'react';
import limitCall from 'lodash/throttle';
import { Indicator } from '../Indicator';
import { RowCenter } from '../Layout/Flex';
import { getStyle } from './style';

// 经过特别计算的滚动事件参数
export interface ScrollEvent {
  containerHeight: number;
  contentHeight: number;
  scrollTop: number;
  maxScroll: number;
  direction: 'upward' | 'downward';
  rawEvent?: React.UIEvent;
}

export interface ScrollViewProps
  extends Omit<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    'onScroll'
  > {
  // 滚动的内容
  children?: React.ReactNode;
  // onScroll节流的频率
  throttle?: number;
  // 容器的高度，默认100%
  height?: CSS.HeightProperty<any>;
  // 触底事件发生的阈值，默认为两个屏幕高度
  reachBottomThreshold?: number;
  // 触底事件
  onReachBottom?: (event: ScrollEvent) => void;
  // 是否显示loading
  showLoading?: boolean;
  // loading内容
  loadingContent?: React.ReactNode;
  // 滚动事件
  onScroll?: (event: ScrollEvent) => void;
  // 容器样式
  containerStyle?: SerializedStyles;
  // 包裹容器样式
  wrapperStyle?: SerializedStyles;
  // 默认的loading样式
  loadingStyle?: SerializedStyles;
}

export function ScrollView(props: ScrollViewProps) {
  const style = getStyle();
  const {
    children,
    height,
    throttle = 300,
    reachBottomThreshold = window.innerHeight * 2,
    onReachBottom,
    showLoading = false,
    loadingContent,
    onScroll,
    containerStyle,
    wrapperStyle,
    loadingStyle,
    ...attrs
  } = props;

  // 容器高度
  const heightStyle: InterpolationWithTheme<any> = {};
  if (height) {
    heightStyle.height = height;
  }

  // 是否显示loading
  const [loadingShow, setLoadingShow] = useState<boolean>(false);

  // 滚动容器
  const container = useRef<HTMLDivElement>(null);

  // 当前滚动到顶部的距离
  const top = useRef<number>(0);

  const scrollCallback = limitCall((rawEvent) => {
    // 滚动内容总高度
    const contentHeight = container.current!.scrollHeight;
    // 容器高度
    const containerHeight = container.current!.getBoundingClientRect().height;
    // 最大滚动距离
    const maxScroll = contentHeight - containerHeight;
    // 已经滚动的距离
    const scrollTop = container.current!.scrollTop;

    // 生成滚动事件参数
    const event: ScrollEvent = {
      containerHeight,
      contentHeight,
      maxScroll,
      scrollTop,
      direction: scrollTop > top.current ? 'downward' : 'upward',
      rawEvent,
    };

    // 调用输入的滚动事件
    onScroll?.(event);

    // 判断是否触发触底事件
    if (
      // 页面在向下滚动
      scrollTop > top.current &&
      // 页面滚动超过阈值
      scrollTop > maxScroll - reachBottomThreshold &&
      // 当前loading不是显示状态
      loadingShow === false
    ) {
      (async () => {
        setLoadingShow(true);
        await onReachBottom?.(event);
        setLoadingShow(false);
      })();
    }
    top.current = scrollTop;
  }, throttle);

  // loading内容
  let showLoadingContent: React.ReactNode = null;
  if (showLoading && loadingShow) {
    if (!loadingContent) {
      showLoadingContent = (
        <RowCenter css={[style.loading, loadingStyle]}>
          <Indicator barColor="#333" barCount={14} />
          <p>数据加载中</p>
        </RowCenter>
      );
    } else {
      showLoadingContent = loadingContent;
    }
  }

  return (
    <div
      css={[style.container, heightStyle, containerStyle]}
      onScroll={scrollCallback}
      ref={container}
      {...attrs}
    >
      <div css={wrapperStyle}>{children}</div>
      {showLoadingContent}
    </div>
  );
}
