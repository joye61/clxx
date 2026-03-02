/** @jsx jsx */
import { Interpolation, jsx, SerializedStyles, Theme } from "@emotion/react";
import * as CSS from "csstype";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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

  // 使用 ref 保存所有滚动处理需要的 props，彻底消除陈旧闭包
  const propsRef = useRef({
    onScroll,
    onReachTop,
    onReachBottom,
    reachTopThreshold,
    reachBottomThreshold,
  });
  propsRef.current = {
    onScroll,
    onReachTop,
    onReachBottom,
    reachTopThreshold,
    reachBottomThreshold,
  };

  // container 是否有滚动条
  const [hasScrollBar, setHasScrollBar] = useState(false);

  // 检查是否有滚动条
  const checkScrollBar = useCallback(() => {
    if (container.current) {
      const hasScroll =
        container.current.scrollHeight > container.current.clientHeight;
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

  // 核心滚动处理逻辑
  // 所有外部值从 ref 读取，deps 为空，引用永远稳定，不存在闭包过期问题
  const processScroll = useCallback((rawEvent?: React.UIEvent) => {
    const box = container.current;
    if (!box) return;

    const {
      onScroll,
      onReachTop,
      onReachBottom,
      reachTopThreshold,
      reachBottomThreshold,
    } = propsRef.current;

    const scrollTop = box.scrollTop;
    const contentHeight = box.scrollHeight;
    // clientHeight 即可视区域高度（不含 border），无需 Math.min(clientHeight, offsetHeight)
    const containerHeight = box.clientHeight;
    const maxScroll = contentHeight - containerHeight;

    // 防止零位移时误判方向（如内容变化触发的 scroll 事件）
    if (scrollTop === lastScrollTop.current && lastScrollTop.current !== 0) {
      return;
    }

    // scrollTop 增大 => 向下滚动；相等（初始 0→0）视为向下
    const direction: "upward" | "downward" =
      scrollTop >= lastScrollTop.current ? "downward" : "upward";

    const event: ScrollEvent = {
      containerHeight,
      contentHeight,
      maxScroll,
      scrollTop,
      direction,
      rawEvent,
    };

    onScroll?.(event);

    // 触顶逻辑（防止重复触发）
    if (direction === "upward" && scrollTop <= reachTopThreshold) {
      if (!hasReachedTop.current) {
        hasReachedTop.current = true;
        hasReachedBottom.current = false;
        onReachTop?.(event);
      }
    } else if (scrollTop > reachTopThreshold) {
      hasReachedTop.current = false;
    }

    // 触底逻辑（防止重复触发）
    if (
      direction === "downward" &&
      maxScroll > 0 &&
      scrollTop >= maxScroll - reachBottomThreshold
    ) {
      if (!hasReachedBottom.current) {
        hasReachedBottom.current = true;
        hasReachedTop.current = false;
        onReachBottom?.(event);
      }
    } else if (scrollTop < maxScroll - reachBottomThreshold) {
      hasReachedBottom.current = false;
    }

    lastScrollTop.current = scrollTop;
  }, []);

  // 节流滚动回调（leading + trailing）
  const scrollCallback = useCallback(
    (rawEvent: React.UIEvent<HTMLDivElement>) => {
      // 不节流时直接执行
      if (scrollThrottle <= 0) {
        processScroll(rawEvent);
        return;
      }

      const now = Date.now();
      const elapsed = now - lastCallTime.current;

      if (elapsed >= scrollThrottle) {
        // 前沿立即执行
        lastCallTime.current = now;
        processScroll(rawEvent);

        // 消除挂起的尾部定时器
        if (throttleTimer.current !== undefined) {
          clearTimeout(throttleTimer.current);
          throttleTimer.current = undefined;
        }
      } else {
        // 尾部调用：按剩余时间调度，保证滚动停止后最终状态被处理
        if (throttleTimer.current !== undefined) {
          clearTimeout(throttleTimer.current);
        }
        throttleTimer.current = window.setTimeout(() => {
          lastCallTime.current = Date.now();
          throttleTimer.current = undefined;
          // 尾部调用不传 rawEvent（已过期），processScroll 从 DOM 读取实时位置
          processScroll();
        }, scrollThrottle - elapsed);
      }
    },
    [scrollThrottle, processScroll]
  );

  // 清理节流定时器
  useEffect(() => {
    return () => {
      if (throttleTimer.current !== undefined) {
        clearTimeout(throttleTimer.current);
      }
    };
  }, []);

  // loading 内容
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
    <div
      css={[style.container, heightStyle, containerStyle]}
      onScroll={scrollCallback}
      ref={container}
      {...attrs}
    >
      <div css={wrapperStyle}>{children}</div>
      {hasScrollBar && showLoadingContent}
    </div>
  );
}
