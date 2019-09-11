/** @jsx jsx */
import { jsx, InterpolationWithTheme } from "@emotion/core";
import { is } from "../is";
import { style } from "./style";
import { useInterval } from "react-use";
import { useRef, useEffect } from "react";
import anime, { AnimeAnimParams } from "animejs";

export interface RollingNoticeProps<E = string> {
  className?: string;
  itemClass?: string;
  itemStyle?: React.CSSProperties;
  height?: number | string;
  list?: Array<E>;
  interval?: number;
  easingDuration?: number;
  // 支持所有animejs的easing属性
  easing?: string;
}

export function RollingNotice<E>(props: RollingNoticeProps<E>) {
  let className = is.string(props.className) ? props.className : undefined;
  let itemClass = is.string(props.itemClass) ? props.itemClass : undefined;
  let itemStyle = is.plainObject(props.itemStyle) ? props.itemStyle : undefined;
  let interval = is.number(props.interval) ? props.interval : 3000;
  let easeingDuration = is.number(props.easingDuration)
    ? props.easingDuration
    : 800;
  let easing = is.string(props.easing) ? props.easing : "easeOutExpo";

  // 滚动间隔不能小于过度间隔
  if (interval < easeingDuration + 100) {
    interval = easeingDuration + 100;
  }
  let list: Array<E> = is.array(props.list) ? props.list : [];

  const customHeight: InterpolationWithTheme<any> = {};
  if (props.height) {
    customHeight.height = props.height;
  }

  if (list.length > 0) {
    list.push(list[0]);
  }

  const indexRef = useRef<number>(0);
  const container = useRef<null | HTMLElement>(null);
  const heightRef = useRef<number>(0);

  useEffect(() => {
    const ul = container.current as HTMLElement;
    const containerElement = ul.parentElement as Element;
    heightRef.current = containerElement.getBoundingClientRect().height;
  }, []);

  useInterval(() => {
    if (list.length > 2) {
      // 获取容器高度，也就是每一个滚动元素的高度
      const height = heightRef.current;

      // 计算即将更新的索引和位置
      const animeOption: AnimeAnimParams = {
        targets: container.current as HTMLElement,
        translateY: -(indexRef.current + 1) * height,
        duration: easeingDuration,
        easing
      };

      // 如果当前为倒数第二个，跳转到倒数第一个
      if (indexRef.current === list.length - 2) {
        animeOption.complete = () => {
          // 此时已经跳转到倒数第一个，立即返回到头部
          indexRef.current = 0;
          anime({
            targets: container.current as HTMLElement,
            translateY: 0,
            duration: 0,
            easing: "steps(1)"
          });
        };
      } else {
        indexRef.current += 1;
      }

      // 执行动画
      anime(animeOption);
    }
  }, interval);

  return (
    <div css={[style.container, customHeight]} className={className}>
      <ul css={style.ul} ref={container as any}>
        {list.map((item, index) => {
          return (
            <li
              key={index}
              css={[style.li, customHeight]}
              style={itemStyle}
              className={itemClass}
            >
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
