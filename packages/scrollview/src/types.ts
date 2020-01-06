import { ScrollbarConfig } from "@better-scroll/scroll-bar";

/**
 * 滚动方向，程序限制了只能单向滚动
 */
export type ScrollDirection = "vertical" | "horizontal";

export type ScrollBarType = boolean | Partial<ScrollbarConfig>;

/**
 * 滚动事件
 */
export type ScrollEvent = { x: number; y: number };

export interface ScrollViewProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  children: React.ReactNode;
  /**
   * 限制只能单向滚动
   */
  direction: ScrollDirection;
  /**
   * 容器宽度
   */
  width: number | string;
  /**
   * 容器高度
   */
  height: number | string;

  /**
   * 滚动监听间隔
   */
  scrollListenInterval: number;

  /**
   * 触顶时触发
   */
  onReachStart: () => void;
  /**
   * 触顶阈值
   */
  reachStartThreshold: number;

  /**
   * 触底时触发
   */
  onReachEnd: () => void;
  /**
   * 触底的阈值
   */
  reachEndThreshold: number;

  /**
   * 是否显示滚动条
   */
  scrollBar: ScrollBarType;
}