import { Interpolation, keyframes, Theme } from "@emotion/react";
import { r } from "../utils/rem";

// translate 走百分比；fill-mode: forwards 保证动画结束后定格在 -50%，
// 与 React 的 setState 提交顺序解耦，杜绝"动画结束帧"回弹到 0 造成的闪烁
export const Bubble = keyframes`
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(0, -50%, 0);
  }
`;

export const style: Record<string, Interpolation<Theme>> = {
  box: {
    position: "relative",
    overflow: "hidden",
    height: r(80),
  },
  wrapper: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "200%",
    // 提示分层，避免动画期间反复合成层切换
    willChange: "transform",
    // 默认静止态，由 animation 驱动
    transform: "translate3d(0, 0, 0)",
  },
  item: {
    width: "100%",
    height: "50%",
    display: "flex",
    alignItems: "center",
    fontSize: "initial",
    // 避免子元素文本溢出影响 box 高度计算
    overflow: "hidden",
  },
  justifyStart: { justifyContent: "flex-start" },
  justifyCenter: { justifyContent: "center" },
  justifyEnd: { justifyContent: "flex-end" },
};

