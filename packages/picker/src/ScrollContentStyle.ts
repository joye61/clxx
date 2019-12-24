import { css } from "@emotion/core";
import { vw } from "@clxx/base";

export const itemHeight = 46;

export const style = {
  container: css({
    height: vw(itemHeight * 5),
    "@media (min-width: 576px)": {
      height: vw(itemHeight * 5, true)
    },

    /**
     * 精简过的swiper样式，保留必要样式
     */
    ".swiper-container": css({
      position: "relative",
      overflow: "hidden",
      padding: 0,
      zIndex: 1,
      height: "100%"
    }),
    ".swiper-wrapper": css({
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      zIndex: 1,
      display: "flex",
      flexDirection: "column",
      transitionProperty: "transform",
      transform: "translate3d(0px, 0, 0)",
      transitionTimingFunction: "ease-out"
    }),
    ".swiper-slide": css({
      flexShrink: 0,
      width: "100%",
      position: "relative",
      transitionProperty: "transform",
      transform: "translate3d(0px, 0, 0)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: vw(itemHeight),
      "@media (min-width: 576px)": {
        height: vw(itemHeight, true),
        fontSize: vw(18, true)
      }
    }),
    ".swiper-slide-text": css({
      color: "#000",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      margin: 0,
      padding: 0,
      fontSize: vw(18),
      "@media (min-width: 576px)": {
        fontSize: vw(18, true)
      }
    })
  }),

  /**
   * 遮罩的样式
   */
  mask: css({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 2,
    "&::before": {
      content: '""',
      display: "block",
      width: "100%",
      height: "100%",
      backgroundColor: "#fff",
      maskImage: `linear-gradient(0deg, #fff 0, rgba(255,255,255,0.6) ${vw(
        itemHeight * 2
      )}, transparent ${vw(itemHeight * 2)}, transparent ${vw(
        itemHeight * 3
      )}, rgba(255,255,255,0.6) ${vw(itemHeight * 3)}, #fff 100%)`,
      "@media (min-width: 576px)": {
        maskImage: `linear-gradient(0deg, #fff 0, transparent ${vw(
          itemHeight * 2,
          true
        )}, transparent ${vw(itemHeight * 2, true)}, transparent ${vw(
          itemHeight * 3,
          true
        )}, transparent ${vw(itemHeight * 3, true)}, #fff 100%)`
      }
    },
    "&::after": {
      content: '""',
      display: "block",
      position: "absolute",
      backgroundColor: `rgba(0,0,0,.1)`,
      width: "100%",
      height: vw(itemHeight),
      top: vw(itemHeight * 2),
      "@media (min-width: 576px)": {
        height: vw(itemHeight, true),
        top: vw(itemHeight * 2, true)
      }
    }
  })
};
