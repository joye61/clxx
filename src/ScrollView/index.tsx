/** @jsx jsx */
import { Interpolation, jsx, SerializedStyles, Theme } from "@emotion/react";
import * as CSS from "csstype";
import { useRef } from "react";
import { Indicator } from "../Indicator";
import { RowCenter } from "../Layout/Flex";
import { getStyle } from "./style";

// 经过特别计算的滚动事件参数
export interface ScrollEvent {
  containerHeight: number;
  contentHeight: number;
  scrollTop: number;
  maxScroll: number;
  direction: "upward" | "downward";
  rawEvent?: React.UIEvent;
}

export interface ScrollViewProps
  extends Omit<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    "onScroll"
  > {
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
  const style = getStyle();
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

  // 是否显示loading
  // const [loadingShow, setLoadingShow] = useState<boolean>(false);

  // 滚动容器
  const container = useRef<HTMLDivElement>(null);

  // 当前滚动到顶部的距离
  const top = useRef<number>(0);

  const scrollCallback = (rawEvent: React.UIEvent<HTMLDivElement>) => {
    // 滚动容器的子元素内容
    const children = container.current!.children;
    // 滚动内容总高度
    const contentHeight = children.item(0)?.scrollHeight;
    // loading高度
    const loadingHeight = children.item(1)?.scrollHeight ?? 0;
    // 容器高度
    const containerHeight = container.current!.getBoundingClientRect().height;
    // 最大滚动距离
    const maxScroll = contentHeight! - containerHeight;
    // 已经滚动的距离
    const scrollTop = container.current!.scrollTop;

    // 生成滚动事件参数
    const event: ScrollEvent = {
      containerHeight,
      contentHeight: contentHeight!,
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
    if (
      event.direction === "downward" &&
      scrollTop > maxScroll - reachBottomThreshold - loadingHeight
    ) {
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
          <Indicator barColor="#666" barCount={14} />
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
      {showLoadingContent}
    </div>
  );
}
