import { Interpolation, Theme } from '@emotion/react';
import { useViewport } from '../Effect/useViewport';

export interface SafeAreaProps extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode;
  // 目前只支持常见的顶部和底部
  type: 'top' | 'bottom';
}

export function SafeArea(props: SafeAreaProps) {
  const { children, type = 'bottom', ...extra } = props;

  useViewport({ viewportFit: 'cover' });

  let boxCss: Interpolation<Theme>;
  if (type === 'top') {
    boxCss = {
      height: [
        `constant(safe-area-inset-top, 0)`,
        `env(safe-area-inset-top, 0)`,
      ],
    };
  } else if (type === 'bottom') {
    boxCss = {
      height: [
        `constant(safe-area-inset-bottom, 0)`,
        `env(safe-area-inset-bottom, 0)`,
      ],
    };
  }

  return (
    <div css={boxCss} {...extra}>
      {children}
    </div>
  );
}
