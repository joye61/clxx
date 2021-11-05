/** @jsx jsx */
import { Interpolation, jsx, SerializedStyles, Theme } from "@emotion/react";
import * as CSS from "csstype";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Indicator } from "../Indicator";
import { RowCenter } from "../Flex/Row";
import { style } from "./style";

// 经过特别计算的滚动事件参数
export interface ScrollEvent {
  containerHeight: number;
  contentHeight: number;
  scrollTop: number;
  maxScroll: number;
  direction: "upward" | "downward";
  rawEvent?: React.UIEvent;
}

export interface ScrollViewProps extends Omit<React.HTMLProps<HTMLDivElement>, "onScroll"> {
  // 滚动的内容
  children?: React.ReactNode;
  // 容器的高度，默认100%
  height?: CSS.Property.Height;
  // 触顶事件的阈值，默认为50像素
  reachTopThreshold?: number;
  // 触顶事件
  onReachTop?: (event: ScrollEvent) => void;
  // 触底事件发生的阈值，默认为50像素
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
  const {
    children,
    height,
    reachTopThreshold = 50,
    onReachTop,
    reachBottomThreshold = 50,
    onReachBottom,
    showLoading = true,
    loadingContent,
    onScroll,
    containerStyle,
    wrapperStyle,
    loadingStyle,
    ...attrs
  } = props;

  // 容器高度
  const heightStyle: Interpolation<Theme> = {};
  if (height) {
    heightStyle.height = height;
  }

  // 滚动容器
  const container = useRef<HTMLDivElement>(null);
  const child = useRef<HTMLDivElement>(null);

  // 当前滚动到顶部的距离
  const top = useRef<number>(0);

  const scrollCallback = (rawEvent: React.UIEvent<HTMLDivElement>) => {
    const box = container.current!;
    // 已经滚动的距离
    const scrollTop = box.scrollTop;
    // 滚动容器的包含滚动内容的高度
    const contentHeight = box.scrollHeight;
    // 滚动容器的视口高度
    const containerHeight = Math.min(box.clientHeight, box.offsetHeight);
    // 加载指示的高度，如果加载指示不存在，则高度为0
    const loadingHeight = (box.children.item(1) as HTMLElement)?.offsetHeight ?? 0;
    const maxScroll = contentHeight - containerHeight;

    // 生成滚动事件参数
    const event: ScrollEvent = {
      containerHeight,
      contentHeight,
      maxScroll,
      scrollTop,
      direction: scrollTop > top.current ? "downward" : "upward",
      rawEvent,
    };

    // 调用输入的滚动事件
    onScroll?.(event);

    // 判断是否触发触顶事件
    if (event.direction === "upward" && scrollTop < reachTopThreshold) {
      onReachTop?.(event);
    }

    // 判断是否触发触底事件
    if (event.direction === "downward" && scrollTop > maxScroll - reachBottomThreshold - loadingHeight) {
      onReachBottom?.(event);
    }

    // 更新scrollTop上次的值
    top.current = scrollTop;
  };

  // loading内容
  let showLoadingContent: React.ReactNode = null;
  if (showLoading) {
    if (!loadingContent) {
      showLoadingContent = (
        <RowCenter css={[style.loading, loadingStyle]}>
          <Indicator barColor="#333" barCount={12} />
          <p>数据加载中...</p>
        </RowCenter>
      );
    } else {
      showLoadingContent = loadingContent;
    }
  }

  // container是否有滚动条
  const [hasScrollBar, setHasScrollBar] = useState(false);

  useEffect(() => {
    let hasScrollBar = container.current!.scrollHeight > container.current!.clientHeight;
    setHasScrollBar(hasScrollBar);
  });

  return (
    <div css={[style.container, heightStyle, containerStyle]} onScroll={scrollCallback} ref={container} {...attrs}>
      <div css={wrapperStyle} ref={child}>
        {children}
      </div>
      {hasScrollBar && showLoadingContent}
    </div>
  );
}
