/** @jsx jsx */
import { jsx, Interpolation, css } from '@emotion/core';
import * as CSS from 'csstype';
import { useState, useEffect } from 'react';
import { style, Bubble } from './style';
import { useInterval } from 'react-use';

export interface CarouselNoticeOption
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  // 需要滚动的列表
  list: Array<React.ReactNode>;
  // 滚动容器的宽度
  width: CSS.WidthProperty<any>;
  // 滚动容器的高度
  height: CSS.HeightProperty<any>;
  // 滚动的内容水平对齐，默认center
  justify: 'start' | 'center' | 'end';
  // 每一次冒泡持续时间(单位毫秒)，默认200ms
  duration: number;
  // 每一轮冒泡切换的时间间(单位毫秒)，默认3000ms
  interval: number;
}

/**
 * 滚动循环轮播公告
 * @param props
 */
export function CarouselNotice(props: Partial<CarouselNoticeOption>) {
  const {
    width,
    height,
    justify = 'center',
    interval = 3000,
    duration = 200,
    list = [],
    ...attrs
  } = props;

  const [current, setCurrent] = useState<number>(0);
  const [animation, setAnimation] = useState<boolean>(false);

  /**
   * 一旦列表发生更新时，触发的逻辑
   */
  useEffect(() => {
    setCurrent(0);
    setAnimation(false);
  }, [list]);

  /**
   * 每隔多少秒更新一次动画
   */
  useInterval(
    () => {
      setAnimation(true);
    },
    list.length > 1 ? interval : null,
  );

  /**
   * 当前显示的两条数据，只用两条数据来轮播
   */
  const showContent = () => {
    const itemStyle: Interpolation<any> = {};
    if (justify === 'center') {
      itemStyle.justifyContent = 'center';
    } else if (justify === 'start') {
      itemStyle.justifyContent = 'flex-start';
    } else if (justify === 'end') {
      itemStyle.justifyContent = 'flex-end';
    } else {
      itemStyle.justifyContent = 'center';
    }

    const itemCss = [itemStyle, style.item];

    if (list.length === 1) {
      return (
        <div css={itemCss} key={0}>
          {list[0]}
        </div>
      );
    }

    const showList: Array<React.ReactNode> = [];
    if (current === list.length - 1) {
      showList.push(
        <div css={itemCss} key={current}>
          {list[list.length - 1]}
        </div>,
      );
      showList.push(
        <div css={itemCss} key={0}>
          {list[0]}
        </div>,
      );
    } else {
      showList.push(
        <div css={itemCss} key={current}>
          {list[current]}
        </div>,
      );
      showList.push(
        <div css={itemCss} key={current + 1}>
          {list[current + 1]}
        </div>,
      );
    }
    return showList;
  };

  /**
   * 获取动画
   */
  const getAnimation = () => {
    if (!animation || list.length <= 1) {
      return null;
    }
    return css({
      animationName: Bubble,
      animationTimingFunction: 'linear',
      animationDuration: `${duration}ms`,
    });
  };

  /**
   * 一轮动画结束时触发下一轮
   */
  const animationEnd = () => {
    let newIndex = current + 1;
    if (current >= list.length - 1) {
      newIndex = 0;
    }
    setCurrent(newIndex);
    setAnimation(false);
  };

  return (
    Array.isArray(list) &&
    list.length > 0 && (
      <div {...attrs} css={[style.box, { width, height }]}>
        <div
          onAnimationEnd={animationEnd}
          css={[style.wrapper, getAnimation()]}
        >
          {showContent()}
        </div>
      </div>
    )
  );
}
