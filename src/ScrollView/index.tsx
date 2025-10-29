/** @jsx jsx */
import { Interpolation, jsx, SerializedStyles, Theme } from "@emotion/react";
import * as CSS from "csstype";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
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
  // 滚动事件节流时间（毫秒），默认 16ms（约60fps）
  scrollThrottle?: number;
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
    scrollThrottle = 16,
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

  // 当前滚动到顶部的距离
  const lastScrollTop = useRef<number>(0);
  
  // 防止重复触发的标记
  const hasReachedTop = useRef<boolean>(false);
  const hasReachedBottom = useRef<boolean>(false);
  
  // 节流控制
  const throttleTimer = useRef<number | undefined>(undefined);
  const lastCallTime = useRef<number>(0);

  // 使用 ref 保存最新的回调函数，避免闭包陈旧
  const callbacksRef = useRef({
    onScroll,
    onReachTop,
    onReachBottom,
  });

  // 每次渲染都更新 ref 中的回调
  callbacksRef.current = {
    onScroll,
    onReachTop,
    onReachBottom,
  };

  // container是否有滚动条
  const [hasScrollBar, setHasScrollBar] = useState(false);

  // 检查是否有滚动条
  const checkScrollBar = useCallback(() => {
    if (container.current) {
      const hasScroll = container.current.scrollHeight > container.current.clientHeight;
      setHasScrollBar(hasScroll);
    }
  }, []);

  // 使用 ResizeObserver 监听内容高度变化
  useLayoutEffect(() => {
    const containerEl = container.current;
    if (!containerEl) return;

    // 初始检查
    checkScrollBar();

    // 使用 ResizeObserver 监听尺寸变化
    const resizeObserver = new ResizeObserver(() => {
      checkScrollBar();
    });

    // 观察容器和内容
    resizeObserver.observe(containerEl);
    if (containerEl.firstElementChild) {
      resizeObserver.observe(containerEl.firstElementChild);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [checkScrollBar]);

  // 滚动回调（带节流）
  const scrollCallback = useCallback((rawEvent: React.UIEvent<HTMLDivElement>) => {
    const now = Date.now();
    
    // 节流控制
    if (scrollThrottle > 0 && now - lastCallTime.current < scrollThrottle) {
      // 清除之前的定时器
      if (throttleTimer.current) {
        clearTimeout(throttleTimer.current);
      }
      
      // 设置新的定时器，确保最后一次调用会被执行
      throttleTimer.current = window.setTimeout(() => {
        handleScroll(rawEvent);
      }, scrollThrottle);
      
      return;
    }

    lastCallTime.current = now;
    handleScroll(rawEvent);
  }, [scrollThrottle, reachTopThreshold, reachBottomThreshold]);

  // 实际的滚动处理逻辑
  const handleScroll = useCallback((rawEvent: React.UIEvent<HTMLDivElement>) => {
    const box = container.current;
    if (!box) return;

    // 已经滚动的距离
    const scrollTop = box.scrollTop;
    // 滚动容器的包含滚动内容的高度
    const contentHeight = box.scrollHeight;
    // 滚动容器的视口高度
    const containerHeight = Math.min(box.clientHeight, box.offsetHeight);
    // 最大可滚动距离
    const maxScroll = contentHeight - containerHeight;

    // 计算滚动方向
    const direction: "upward" | "downward" = scrollTop > lastScrollTop.current ? "downward" : "upward";

    // 生成滚动事件参数
    const event: ScrollEvent = {
      containerHeight,
      contentHeight,
      maxScroll,
      scrollTop,
      direction,
      rawEvent,
    };

    // 调用通用滚动事件（使用 ref 中的最新回调）
    callbacksRef.current.onScroll?.(event);

    // 触顶逻辑（防止重复触发）
    if (direction === "upward" && scrollTop <= reachTopThreshold) {
      if (!hasReachedTop.current) {
        hasReachedTop.current = true;
        hasReachedBottom.current = false; // 重置触底标记
        callbacksRef.current.onReachTop?.(event);
      }
    } else if (scrollTop > reachTopThreshold) {
      hasReachedTop.current = false;
    }

    // 触底逻辑（防止重复触发）
    if (direction === "downward" && scrollTop >= maxScroll - reachBottomThreshold) {
      if (!hasReachedBottom.current) {
        hasReachedBottom.current = true;
        hasReachedTop.current = false; // 重置触顶标记
        callbacksRef.current.onReachBottom?.(event);
      }
    } else if (scrollTop < maxScroll - reachBottomThreshold) {
      hasReachedBottom.current = false;
    }

    // 更新scrollTop上次的值
    lastScrollTop.current = scrollTop;
  }, [reachTopThreshold, reachBottomThreshold]);

  // 清理节流定时器
  useLayoutEffect(() => {
    return () => {
      if (throttleTimer.current) {
        clearTimeout(throttleTimer.current);
      }
    };
  }, []);

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

  return (
    <div css={[style.container, heightStyle, containerStyle]} onScroll={scrollCallback} ref={container} {...attrs}>
      <div css={wrapperStyle}>
        {children}
      </div>
      {hasScrollBar && showLoadingContent}
    </div>
  );
}
