/** @jsx jsx */
import { jsx, ObjectInterpolation } from "@emotion/core";
import { useRef, useEffect } from "react";
import { style } from "./style";
import BScroll, { Options } from "@better-scroll/core";
import ScrollBar from "@better-scroll/scroll-bar";
import throttle from "lodash/throttle";
import { ScrollViewProps, ScrollEvent, ScrollDirection, ScrollBarType } from "./types";

export function ScrollView(props: Partial<ScrollViewProps>) {
  const {
    children,
    width,
    height,
    onReachStart,
    onReachEnd,
    reachStartThreshold = 50,
    reachEndThreshold = 50,
    scrollListenInterval = 100,
    direction = "vertical",
    scrollBar = false,
    ...attributes
  } = props;
  const container = useRef<HTMLDivElement>(null);

  /**
   * 根据方位设置容器和内容的样式
   */
  let containerStyle: ObjectInterpolation<any> = {};
  let contentStyle: ObjectInterpolation<any> = {};
  if (direction === "vertical") {
    containerStyle.height = height ?? "100%";
    containerStyle.width = width;
    contentStyle.width = "100%";
  } else {
    containerStyle.width = width ?? "100%";
    containerStyle.height = height;
    contentStyle.height = "100%";
  }

  /**
   * BetterScroll对象的引用
   */
  const bsRef = useRef<BScroll>(null);

  /**
   * 临界的事件处理程序
   */
  const scrollHandler = (event: ScrollEvent) => {
    const bs = bsRef.current;

    if (bs instanceof BScroll) {
      // 垂直方向临界检测
      if (direction === "vertical") {
        // 触顶
        if (
          bs.movingDirectionY === -1 &&
          Math.abs(event.y) <= Math.abs(reachStartThreshold)
        ) {
          onReachStart?.();
        }

        // 触底
        if (
          bs.movingDirectionY === 1 &&
          Math.abs(event.y - bs.maxScrollY) <= Math.abs(reachEndThreshold)
        ) {
          onReachEnd?.();
        }
      }

      // 水平方向临界检测
      else {
        // 触顶
        if (
          bs.movingDirectionX === -1 &&
          Math.abs(event.x) <= Math.abs(reachStartThreshold)
        ) {
          onReachStart?.();
        }

        // 触底
        if (
          bs.movingDirectionX === 1 &&
          Math.abs(event.x - bs.maxScrollX) <= Math.abs(reachEndThreshold)
        ) {
          onReachEnd?.();
        }
      }
    }
  };

  const scrollHandlerRef = useRef<(event: ScrollEvent) => void>(scrollHandler);

  /**
   * 防止BetterScroll多次实例化，将这些被依赖的参数置于ref中
   */
  const extraRef = useRef<{
    direction: ScrollDirection;
    scrollListenInterval: number;
    scrollBar: ScrollBarType;
  }>({
    direction,
    scrollListenInterval,
    scrollBar
  });

  /**
   * 只会初始化一次
   */
  useEffect(() => {
    const bsOption: Partial<Options> = {
      freeScroll: false,
      click: true,
      probeType: 3
    };

    /**
     * 如果要显示滚动条，注入并初始化
     */
    if (scrollBar) {
      BScroll.use(ScrollBar);
      bsOption.scrollbar = scrollBar;
    }

    /**
     * 限制只能一个方向滚动
     */
    if (extraRef.current.direction === "vertical") {
      bsOption.scrollX = false;
      bsOption.scrollY = true;
    } else {
      bsOption.scrollX = true;
      bsOption.scrollY = false;
    }
    (bsRef as any).current = new BScroll(container.current!, bsOption);

    /**
     * 监听滚动逻辑
     */
    (bsRef as any).current.on(
      "scroll",
      throttle(
        (event: ScrollEvent) => {
          scrollHandlerRef.current(event);
        },
        extraRef.current.scrollListenInterval,
        {
          leading: true,
          trailing: true
        }
      )
    );

    return () => {
      bsRef.current!.destroy();
    };
  }, []);

  /**
   * 只要组件发生属性的变化，刷新滚动
   */
  useEffect(() => {
    // 更新只执行一次的effect依赖
    scrollHandlerRef.current = scrollHandler;
    extraRef.current = {
      direction,
      scrollListenInterval,
      scrollBar
    };

    // 只有当BetterScroll实例存在时，才处理刷新
    if (bsRef.current instanceof BScroll) {
      bsRef.current.refresh();
    }
  });

  return (
    <div
      css={[style.container, containerStyle]}
      {...attributes}
      ref={container}
    >
      <div css={[style.content, contentStyle]}>{children}</div>
    </div>
  );
}
