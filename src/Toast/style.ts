import { css, keyframes } from '@emotion/core';
import { vw } from '../utils/cssUtil';
import { getEnv } from '../utils/global';

const env = getEnv();

export const showAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50%) scale(0.6);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
`;

export const hideAnimation = keyframes`
  from {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(-50%) scale(0.6);
  }
`;

export const style = {
  container: css({
    position: 'fixed',
    maxWidth: '80%',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 9999,
    [`@media (min-width: ${env.criticalWidth}px)`]: {
      maxWidth: `${env.criticalWidth * 0.8}px`,
    },
  }),
  containerShow: css({ animation: `${showAnimation} 200ms` }),
  containerHide: css({ animation: `${hideAnimation} 200ms` }),
  top: css({
    top: vw(30),
    [`@media (min-width: ${env.criticalWidth}px)`]: {
      top: vw(30, true),
    },
  }),
  middle: css({ top: '50%' }),
  bottom: css({
    bottom: vw(30),
    [`@media (min-width: ${env.criticalWidth}px)`]: {
      bottom: vw(30, true),
    },
  }),
  content: (rounded: boolean) => {
    return css({
      backgroundColor: 'rgba(50, 50, 50, 0.75)',
      color: '#fff',
      margin: 0,
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      fontSize: vw(14),
      lineHeight: vw(36),
      padding: `0 ${vw(15)}`,
      borderRadius: rounded ? vw(18) : 0,
      [`@media (min-width: ${env.criticalWidth}px)`]: {
        fontSize: vw(14, true),
        lineHeight: vw(36, true),
        padding: `0 ${vw(15, true)}`,
        borderRadius: rounded ? vw(18, true) : 0,
      },
    });
  },
};
