import { keyframes } from "@emotion/react";

/**
 * iOS 菊花单条 bar 的不透明度衰减动画
 * 1 -> 0.18 线性衰减；keyframes 与颜色解耦，全局共享单例，
 * 走 opacity 触发 GPU 合成而非 SVG paint，性能更高。
 */
export const barFadeKeyframes = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0.18; }
`;

