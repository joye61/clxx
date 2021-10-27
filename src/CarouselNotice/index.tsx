/** @jsx jsx */
import { jsx, Interpolation, css, Theme } from "@emotion/react";
import * as CSS from "csstype";
import { useState, useEffect } from "react";
import { useInterval } from "../effect/useInterval";
import { style, Bubble } from "./style";

export interface CarouselNoticeOption
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  // 需要滚动的列表
  list: Array<React.ReactNode>;
  // 滚动容器的宽度
  width: CSS.Property.Width;
  // 滚动容器的高度
  height: CSS.Property.Height;
  // 滚动的内容水平对齐，默认center
  justify: "start" | "center" | "end";
  // 每一次冒泡持续时间(单位毫秒)，默认200ms
  duration: number;
  // 每一轮冒泡切换的时间间(单位毫秒)，默认3000ms
  interval: number;
  // 容器样式
  containerStyle?: Interpolation<Theme>;
  // 内部容器样式
  wrapperStyle?: Interpolation<Theme>;
  // 条目样式
  itemStyle?: Interpolation<Theme>;
}

/**
 * 滚动循环轮播公告
 * @param props
 */
export function CarouselNotice(props: Partial<CarouselNoticeOption>) {
  const {
    width,
    height,
    justify = "center",
    interval = 3000,
    duration = 200,
    list = [],
    containerStyle,
    wrapperStyle,
    itemStyle,
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
    list.length > 1 ? interval : null
  );

  /**
   * 当前显示的两条数据，只用两条数据来轮播
   */
  const showContent = () => {
    const justifyStyle: Interpolation<any> = {};
    if (justify === "center") {
      justifyStyle.justifyContent = "center";
    } else if (justify === "start") {
      justifyStyle.justifyContent = "flex-start";
    } else if (justify === "end") {
      justifyStyle.justifyContent = "flex-end";
    } else {
      justifyStyle.justifyContent = "center";
    }

    const itemCss = [style.item, justifyStyle];

    if (list.length === 1) {
      return (
        <div css={[itemCss, itemStyle]} key={0}>
          {list[0]}
        </div>
      );
    }

    const showList: Array<React.ReactNode> = [];
    if (current === list.length - 1) {
      showList.push(
        <div css={[itemCss, itemStyle]} key={current}>
          {list[list.length - 1]}
        </div>
      );
      showList.push(
        <div css={[itemCss, itemStyle]} key={0}>
          {list[0]}
        </div>
      );
    } else {
      showList.push(
        <div css={[itemCss, itemStyle]} key={current}>
          {list[current]}
        </div>
      );
      showList.push(
        <div css={[itemCss, itemStyle]} key={current + 1}>
          {list[current + 1]}
        </div>
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
      animationTimingFunction: "linear",
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
      <div {...attrs} css={[style.box, { width, height }, containerStyle]}>
        <div onAnimationEnd={animationEnd} css={[style.wrapper, getAnimation(), wrapperStyle]}>
          {showContent()}
        </div>
      </div>
    )
  );
}
