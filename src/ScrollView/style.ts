import { css } from '@emotion/core';
import { getEnv } from '../utils/global';
import { vw } from '../utils/cssUtil';

export const getStyle = () => {
  const env = getEnv();

  return {
    container: css({
      overflow: 'auto',
      height: '100%',
      WebkitOverflowScrolling: 'touch',
    }),
    loading: css({
      padding: `${vw(15)} 0`,
      '> div': {
        width: vw(15),
        height: vw(15),
      },
      '> p': {
        margin: `0 0 0 ${vw(8)}`,
        fontSize: vw(12),
        color: '#999',
      },
      [`@media (min-width: ${env.criticalWidth}px)`]: {
        padding: `${vw(10, true)} 0`,
        '> div': {
          width: vw(16, true),
          height: vw(16, true),
        },
        '> p': {
          margin: `0 0 0 ${vw(5, true)}`,
          fontSize: vw(13, true),
        },
      },
    }),
  };
};
