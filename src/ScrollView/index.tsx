import { Interpolation, Theme } from "@emotion/react";
import * as CSS from "csstype";
import {
  CSSProperties,
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { style } from "./style";

// 经过特别计算的滚动事件参数
export interface ScrollEvent {
  containerHeight: number;
  contentHeight: number;
  scrollTop: number;
  maxScroll: number;
  direction: "upward" | "downward";
  rawEvent?: Event;
}

// 通过 ref 暴露的命令式 API
export interface ScrollViewHandle {
  // 直接拿底层 DOM 节点
  getElement: () => HTMLDivElement | null;
  // 滚动到任意位置
  scrollTo: (options: { top: number; behavior?: ScrollBehavior }) => void;
  // 滚动到顶部
  scrollToTop: (behavior?: ScrollBehavior) => void;
  // 滚动到底部
  scrollToBottom: (behavior?: ScrollBehavior) => void;
  // 滚动到指定元素（支持 selector 字符串或 HTMLElement 引用）
  scrollToElement: (
    target: HTMLElement | string,
    options?: { offset?: number; behavior?: ScrollBehavior },
  ) => void;
}

export interface ScrollViewProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onScroll"> {
  // 滚动的内容
  children?: ReactNode;
  // 容器的高度，默认 100%
  height?: CSS.Property.Height;
  // 触顶阈值（像素），默认 50
  reachTopThreshold?: number;
  onReachTop?: (event: ScrollEvent) => void;
  // 触底阈值（像素），默认 50
  reachBottomThreshold?: number;
  onReachBottom?: (event: ScrollEvent) => void;
  // 是否显示底部 loading（仅在内容可滚动时实际显示），默认 true
  showLoading?: boolean;
  // 自定义 loading 内容
  loadingContent?: ReactNode;
  // 滚动事件回调（已通过 rAF 自然节流到每帧一次）
  onScroll?: (event: ScrollEvent) => void;
  // 容器样式
  containerStyle?: Interpolation<Theme>;
  // 内容包裹层样式
  wrapperStyle?: Interpolation<Theme>;
  // 默认 loading 容器样式
  loadingStyle?: Interpolation<Theme>;
}

export const ScrollView = forwardRef<ScrollViewHandle, ScrollViewProps>(
  function ScrollView(props, ref) {
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
      style: userStyle,
      ...attrs
    } = props;

    // 滚动容器与内容包装层
    const containerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // 用 ref 持有最新的回调与阈值，处理函数引用稳定，避免 listener 反复绑定 / 闭包过期
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

    // 上次 scrollTop（推断方向）
    const lastScrollTopRef = useRef(0);
    // 上次方向；delta==0 时沿用，避免水平滚动 / ResizeObserver / 浮点抖动误判
    const lastDirectionRef = useRef<"upward" | "downward">("downward");
    // 阈值边界防抖：避免在阈值带内反复触发
    const reachedTopRef = useRef(false);
    const reachedBottomRef = useRef(false);
    // RAF 节流相关
    const rafIdRef = useRef<number | null>(null);
    const pendingEventRef = useRef<Event | null>(null);

    // 是否真的可滚动；用于决定是否显示底部 loading
    const [scrollable, setScrollable] = useState(false);

    // 真正处理一次滚动（始终从 DOM 读最新位置，避免依赖陈旧 event）
    const processScroll = useCallback((rawEvent?: Event) => {
      const box = containerRef.current;
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
      const containerHeight = box.clientHeight;
      const maxScroll = Math.max(0, contentHeight - containerHeight);

      const last = lastScrollTopRef.current;
      const delta = scrollTop - last;
      // 0.5 容差屏蔽 hi-DPI 浮点抖动；|delta|<=0.5 视为无方向变化，沿用上次
      let direction: "upward" | "downward" = lastDirectionRef.current;
      if (delta < -0.5) direction = "upward";
      else if (delta > 0.5) direction = "downward";
      lastDirectionRef.current = direction;

      const event: ScrollEvent = {
        containerHeight,
        contentHeight,
        maxScroll,
        scrollTop,
        direction,
        rawEvent,
      };

      onScroll?.(event);

      // 触顶：仅在向上滚动且进入阈值带时触发一次
      if (direction === "upward" && scrollTop <= reachTopThreshold) {
        if (!reachedTopRef.current) {
          reachedTopRef.current = true;
          reachedBottomRef.current = false;
          onReachTop?.(event);
        }
      } else if (scrollTop > reachTopThreshold) {
        // 离开阈值带后允许下次再次触发
        reachedTopRef.current = false;
      }

      // 触底：仅在确实可滚动且向下滚动进入阈值带时触发一次
      if (
        direction === "downward" &&
        maxScroll > 0 &&
        scrollTop >= maxScroll - reachBottomThreshold
      ) {
        if (!reachedBottomRef.current) {
          reachedBottomRef.current = true;
          reachedTopRef.current = false;
          onReachBottom?.(event);
        }
      } else if (scrollTop < maxScroll - reachBottomThreshold) {
        reachedBottomRef.current = false;
      }

      lastScrollTopRef.current = scrollTop;
    }, []);

    // RAF 节流：连续滚动期间一帧只处理一次，最后一次 scroll 也会被处理（pending 会触发）
    const scheduleProcess = useCallback(
      (rawEvent: Event) => {
        pendingEventRef.current = rawEvent;
        if (rafIdRef.current !== null) return;
        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = null;
          const ev = pendingEventRef.current;
          pendingEventRef.current = null;
          processScroll(ev ?? undefined);
        });
      },
      [processScroll],
    );

    // 直接绑定原生 scroll 事件（passive: true），避免 React 合成事件中介
    useEffect(() => {
      const box = containerRef.current;
      if (!box) return;

      // 用 DOM 当前位置初始化 lastScrollTop，兼容路由切回 / SSR 恢复滚动位置
      lastScrollTopRef.current = box.scrollTop;

      const handler = (e: Event) => scheduleProcess(e);
      box.addEventListener("scroll", handler, { passive: true });
      return () => {
        box.removeEventListener("scroll", handler);
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        pendingEventRef.current = null;
      };
    }, [scheduleProcess]);

    // 监听容器与内容尺寸变化，自动维护 scrollable
    useLayoutEffect(() => {
      const box = containerRef.current;
      const wrap = wrapperRef.current;
      if (!box || !wrap) return;

      const update = () => {
        // +1 容差：屏蔽 hi-DPI 下 scrollHeight = clientHeight + 0.5 之类的误判
        const next = box.scrollHeight - box.clientHeight > 1;
        setScrollable((prev) => (prev === next ? prev : next));
      };

      update();

      // 旧浏览器无 ResizeObserver 时降级：仅初始检测一次
      if (typeof ResizeObserver === "undefined") return;

      const ro = new ResizeObserver(update);
      ro.observe(box);
      ro.observe(wrap);
      return () => ro.disconnect();
    }, []);

    // 暴露命令式 API
    useImperativeHandle(
      ref,
      () => ({
        getElement: () => containerRef.current,
        scrollTo: ({ top, behavior = "auto" }) => {
          containerRef.current?.scrollTo({ top, behavior });
        },
        scrollToTop: (behavior = "auto") => {
          containerRef.current?.scrollTo({ top: 0, behavior });
        },
        scrollToBottom: (behavior = "auto") => {
          const box = containerRef.current;
          if (!box) return;
          box.scrollTo({ top: box.scrollHeight, behavior });
        },
        scrollToElement: (target, options = {}) => {
          const box = containerRef.current;
          if (!box) return;
          const el =
            typeof target === "string"
              ? box.querySelector<HTMLElement>(target)
              : target;
          if (!el || !box.contains(el)) return;
          // 用 getBoundingClientRect 计算偏移，兼容任意定位上下文
          const top =
            el.getBoundingClientRect().top -
            box.getBoundingClientRect().top +
            box.scrollTop +
            (options.offset ?? 0);
          box.scrollTo({ top, behavior: options.behavior ?? "auto" });
        },
      }),
      [],
    );

    // 合并 height 与外部传入 style；height 优先级高于 userStyle.height
    const mergedStyle = useMemo<CSSProperties | undefined>(() => {
      if (height === undefined) return userStyle;
      return { ...userStyle, height };
    }, [height, userStyle]);

    // 默认 loading：iOS 风三点跳动
    const defaultLoading = (
      <div css={[style.loading, loadingStyle]}>
        <span css={style.loadingDot} />
        <span css={style.loadingDot} />
        <span css={style.loadingDot} />
      </div>
    );

    return (
      <div
        {...attrs}
        css={[style.container, containerStyle]}
        style={mergedStyle}
        ref={containerRef}
      >
        <div ref={wrapperRef} css={wrapperStyle}>
          {children}
        </div>
        {showLoading && scrollable && (loadingContent ?? defaultLoading)}
      </div>
    );
  },
);
