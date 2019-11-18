import { css } from "@emotion/core";

/**
 * 滚动公告样式
 * @param height 容器高度
 * @param fontSize 默认滚动字体的尺寸
 */
export const style = (
  height: number | string,
  fontSize: number | string,
  bubbleDuration: number
) => {
  return {
    container: css({
      position: "relative",
      height,
      overflow: "hidden"
    }),
    withScroll: css({
      transition: `transform ${bubbleDuration}ms ease`,
      transform: `translateY(-${
        typeof height === "number" ? height + "px" : height
      })`
    }),
    ul: css({
      listStyleType: "none",
      margin: 0,
      padding: 0,
      position: "absolute",
      left: 0,
      top: 0,
      fontSize: 0
    }),
    li: css({
      margin: 0,
      padding: 0,
      height
    }),
    textItem: css({
      fontSize,
      display: "flex",
      alignItems: "center",
      height: "100%",
      margin: 0,
      padding: 0,
      whiteSpace: "nowrap"
    })
  };
};
