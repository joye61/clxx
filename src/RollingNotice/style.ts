import { css } from "@emotion/core";
import { vw } from "../cssUtil";

/**
 * 滚动公告样式
 * @param height 容器高度
 * @param fontSize 默认滚动字体的尺寸
 */
export const style = (
  height?: number | string,
  fontSize?: number | string,
  bubbleDuration?: number
) => {
  let h: number | string | undefined;
  if(typeof height === 'undefined') {
    h = vw(32);
  } else if(typeof height === 'number') {
    h = `${height}px`;
  } else {
    h = height;
  }

  return {
    container: css({
      position: "relative",
      height: h,
      overflow: "hidden"
    }),
    withScroll: css({
      transition: `transform ${bubbleDuration}ms ease`,
      transform: `translateY(-${h})`
    }),
    ul: css({
      listStyleType: "none",
      margin: 0,
      padding: 0,
      position: "absolute",
      left: 0,
      top: 0,
      fontSize: 0,
      width: "100%"
    }),
    li: css({
      margin: 0,
      padding: 0,
      height: h
    }),
    textItem: css({
      display: "flex",
      alignItems: "center",
      height: "100%",
      margin: 0,
      padding: 0,
      whiteSpace: "nowrap",
      fontSize: typeof fontSize === "undefined" ? vw(14) : fontSize
    })
  };
};
