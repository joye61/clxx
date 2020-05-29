import { keyframes } from '@emotion/core';

/**
 * 获取转圈每一条bar的过渡动画
 * @param color
 */
export function getBarChangeKeyFrames(color: string) {
  return keyframes`
  from {
    fill: ${color};
  }
  to {
    fill: transparent;
  }
  `;
}
