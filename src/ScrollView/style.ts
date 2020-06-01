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
      padding: `${vw(10)} 0`,
      '> div': {
        width: vw(16),
        height: vw(16),
      },
      '> p': {
        margin: `0 0 0 ${vw(5)}`,
        fontSize: vw(13),
        color: '#666',
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
