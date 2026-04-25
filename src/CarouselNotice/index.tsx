import {
  AnimationEvent,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Interpolation, css, Theme } from "@emotion/react";
import * as CSS from "csstype";
import { useInterval } from "../Effect/useInterval";
import { style, Bubble } from "./style";

export interface CarouselNoticeProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  // 需要滚动的列表
  list: Array<ReactNode>;
  // 滚动容器的宽度
  width?: CSS.Property.Width;
  // 滚动容器的高度
  height?: CSS.Property.Height;
  // 滚动的内容水平对齐，默认 center
  justify?: "start" | "center" | "end";
  // 每一次冒泡持续时间(单位毫秒)，默认 400ms
  duration?: number;
  // 每一轮冒泡切换的时间间(单位毫秒)，默认 3000ms
  interval?: number;
  // 容器样式
  containerStyle?: Interpolation<Theme>;
  // 内部容器样式
  wrapperStyle?: Interpolation<Theme>;
  // 条目样式
  itemStyle?: Interpolation<Theme>;
}

// 兼容旧名称
export type CarouselNoticeOption = CarouselNoticeProps;

const justifyMap = {
  start: style.justifyStart,
  center: style.justifyCenter,
  end: style.justifyEnd,
} as const;

/**
 * 滚动循环轮播公告
 *
 * 实现要点：
 *  - 渲染当前条 + 下一条共两项，wrapper 高 200%
 *  - 用 keyframes 把 wrapper 从 0 推到 -50%，配合 fill-mode: forwards
 *    保证动画结束后定格在 -50%，与 React 提交解耦，杜绝"回弹闪烁"
 *  - animationend 触发后同步切换 current（新 current 的第一项 = 旧 current 的第二项）
 *    且 wrapper 因 key 变化重挂载，回到 0 即开始下一轮
 */
export function CarouselNotice(props: CarouselNoticeProps) {
  const {
    width,
    height,
    justify = "center",
    interval = 3000,
    duration = 400,
    list,
    containerStyle,
    wrapperStyle,
    itemStyle,
    ...attrs
  } = props;

  const safeList = Array.isArray(list) ? list : [];
  const len = safeList.length;

  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  // list 变化：归零 + 取消动画态；用引用比较保险
  const lastListRef = useRef(safeList);
  if (lastListRef.current !== safeList) {
    lastListRef.current = safeList;
  }
  useEffect(() => {
    setCurrent(0);
    setAnimating(false);
  }, [safeList]);

  // current 越界保护（list 缩短时）
  useEffect(() => {
    if (len > 0 && current >= len) {
      setCurrent(0);
      setAnimating(false);
    }
  }, [len, current]);

  // 定时触发动画；只有列表 >1 条且未在动画中才启动 interval
  useInterval(
    () => {
      // 若上一轮动画还没结束（极端时序），跳过本次
      if (!animating) setAnimating(true);
    },
    len > 1 ? interval : null,
  );

  // 容器尺寸样式（仅在 width/height 变化时重建）
  const sizeStyle = useMemo<Interpolation<Theme>>(
    () => ({ width, height }),
    [width, height],
  );

  // 对齐样式（静态映射，无新对象产生）
  const justifyStyle = justifyMap[justify] ?? style.justifyCenter;

  // 动画 css（仅依赖 duration，缓存复用）
  const animationCss = useMemo(
    () =>
      css({
        animationName: `${Bubble}`,
        animationTimingFunction: "ease-in-out",
        animationDuration: `${duration}ms`,
        animationFillMode: "forwards",
      }),
    [duration],
  );

  // 动画结束：切到下一条 + 重置动画态
  const handleAnimationEnd = useCallback(
    (e: AnimationEvent<HTMLDivElement>) => {
      // 防止子元素动画事件冒泡误触
      if (e.currentTarget !== e.target) return;
      setCurrent((prev) => (prev + 1) % len);
      setAnimating(false);
    },
    [len],
  );

  // 当前显示的两条
  const items = useMemo<ReactNode[]>(() => {
    if (len === 0) return [];
    if (len === 1) {
      return [
        <div css={[style.item, justifyStyle, itemStyle]} key="only">
          {safeList[0]}
        </div>,
      ];
    }
    const nextIndex = (current + 1) % len;
    return [
      <div
        css={[style.item, justifyStyle, itemStyle]}
        key={`a-${current}`}
      >
        {safeList[current]}
      </div>,
      <div
        css={[style.item, justifyStyle, itemStyle]}
        key={`b-${nextIndex}`}
      >
        {safeList[nextIndex]}
      </div>,
    ];
  }, [safeList, current, len, justifyStyle, itemStyle]);

  if (len === 0) return null;

  return (
    <div {...attrs} css={[style.box, sizeStyle, containerStyle]}>
      <div
        // key 绑定动画态：动画结束后 React 重挂载 wrapper，
        // 自然把 transform 重置回 0，并以新 current 渲染下一对内容
        key={animating ? `anim-${current}` : `idle-${current}`}
        onAnimationEnd={handleAnimationEnd}
        css={[
          style.wrapper,
          animating && len > 1 ? animationCss : null,
          wrapperStyle,
        ]}
      >
        {items}
      </div>
    </div>
  );
}

