/** @jsx jsx */
import { jsx, Global, css, CSSObject } from '@emotion/react';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { useWindowResize } from '../effect/useWindowResize';
import { clxxGetEnv } from '../utils/global';

export interface ContainerProps {
  // 设计稿尺寸
  designWidth?: number;
  // 移动和非移动的临界尺寸
  criticalWidth?: number;
  // 用户自定义的全局样式
  globalStyles?: CSSObject;
  // 容器包裹的子元素
  children?: React.ReactNode;
}

/**
 * 自适应容器
 * @param props
 */
export function Container(props: ContainerProps) {
  // 获取环境变量
  const env = clxxGetEnv();
  const {
    designWidth = env.designWidth,
    criticalWidth = env.criticalWidth,
    globalStyles,
    children,
  } = props;

  /**
   * 获取HTML根元素的计算尺寸
   */
  const computeFontSize = () => {
    const windowWidth = window.innerWidth;
    const usedSize = windowWidth > criticalWidth ? criticalWidth : windowWidth;

    return (usedSize * 100) / designWidth;
  };

  // 基准字体尺寸
  const [baseFontSize, setBaseFontSize] = useState<number>(computeFontSize());

  // 移除useLayoutEffect的依赖，保证只会被执行一次
  const scaleRef = useRef<() => void>(() => {
    let computeSize = parseFloat(
      window.getComputedStyle(document.documentElement).fontSize,
    );

    if (typeof computeSize === 'number' && computeSize !== baseFontSize) {
      setBaseFontSize(baseFontSize ** 2 / computeSize);
    }
  });

  // 防止UI突闪
  useLayoutEffect(scaleRef.current, []);
  // 监听页面尺寸变化
  useWindowResize(() => setBaseFontSize(() => computeFontSize()));

  // 一些初始化逻辑
  useLayoutEffect(() => {
    const activable = () => {};
    document.body.addEventListener('touchstart', activable);
    return () => {
      document.body.removeEventListener('touchstart', activable);
    };
  }, []);

  return (
    <React.Fragment>
      <Global
        styles={[
          css({
            '*': {
              boxSizing: 'border-box',
            },
            html: {
              WebkitTapHighlightColor: 'transparent',
              WebkitOverflowScrolling: 'touch',
              WebkitTextSizeAdjust: '100%',
              fontSize: `${baseFontSize}px`,
              touchAction: 'manipulation',
            },
            body: {
              fontSize: '16px',
              margin: '0 auto',
              maxWidth: `${criticalWidth}px`,
            },
            [`@media (min-width: ${criticalWidth}px)`]: {
              html: {
                fontSize: `${(100 * criticalWidth) / designWidth}px`,
              },
            },
          }),
          globalStyles,
        ]}
      />
      {children}
    </React.Fragment>
  );
}
