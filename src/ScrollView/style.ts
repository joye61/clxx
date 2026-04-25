import { css, keyframes } from "@emotion/react";
import type { Interpolation, Theme } from "@emotion/react";

// 模仿 iOS「正在输入」气泡的三点呼吸节奏
const dotPulse = keyframes`
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.35;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
`;

export const style: Record<string, Interpolation<Theme>> = {
  container: {
    overflow: "auto",
    height: "100%",
    WebkitOverflowScrolling: "touch",
  },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: ".12rem",
    padding: ".24rem 0",
  },
  loadingDot: css`
    width: 0.12rem;
    height: 0.12rem;
    border-radius: 50%;
    background: #c7c7cc;
    animation: ${dotPulse} 1.2s ease-in-out infinite both;

    &:nth-of-type(1) {
      animation-delay: -0.32s;
    }
    &:nth-of-type(2) {
      animation-delay: -0.16s;
    }
  `,
};
