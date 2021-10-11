import { css } from '@emotion/react';
import { ClxxScreenEnv, vw } from '../utils/cssUtil';

export const style = {
  container: css({
    overflow: 'auto',
    height: '100%',
    WebkitOverflowScrolling: 'touch',
  }),
  loading: css({
    padding: `${vw(30)} 0`,
    '> div': {
      width: vw(30),
      height: vw(30),
    },
    '> p': {
      margin: `0 0 0 ${vw(16)}`,
      fontSize: vw(24),
      color: '#999',
    },
    [`@media (min-width: ${ClxxScreenEnv.CriticalWidth}px)`]: {
      padding: `${vw(20, true)} 0`,
      '> div': {
        width: vw(32, true),
        height: vw(32, true),
      },
      '> p': {
        margin: `0 0 0 ${vw(10, true)}`,
        fontSize: vw(26, true),
      },
    },
  }),
};
