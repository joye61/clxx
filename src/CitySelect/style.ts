import { css, Interpolation, Theme } from "@emotion/react";
import { darken } from "../utils/color";
import { fontStack } from "../utils/theme";

// 设计变量
const textPrimary = "#1f2328";
const textSecondary = "#6b7280";
const textTertiary = "#9ca3af";
const bgPage = "#ffffff";
const bgSubtle = "#f5f6f8";
const border = "#e5e7eb";

export type CitySelectStyle = Record<string, Interpolation<Theme>>;

// 根据 primary 色值生成一整套样式；primaryActive 由 primary 派生
export function createStyle(primary: string): CitySelectStyle {
  const primaryActive = darken(primary, 0.15);
  return {
    // 内容容器：动画/全屏由 Dialog (pullLeft) 提供，这里只保留视觉与排版。
    // 内部 sidebar / bigLetter 使用 absolute 时，以此为定位上下文。
    inner: css({
      position: "relative",
      width: "100%",
      height: "100%",
      backgroundColor: bgPage,
      userSelect: "none",
      color: textPrimary,
      fontFamily: fontStack,
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    }),
    sidebar: css({
      position: "absolute",
      top: "50%",
      right: ".12rem",
      transform: "translateY(-50%)",
      zIndex: 2,
      padding: ".1rem .06rem",
      borderRadius: ".3rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: ".02rem",
    }),
    letter: css({
      width: ".36rem",
      height: ".36rem",
      lineHeight: ".36rem",
      textAlign: "center",
      fontSize: ".22rem",
      fontFamily: "Arial, sans-serif",
      fontWeight: 500,
      borderRadius: "50%",
      color: textSecondary,
      transition: "background-color .15s, color .15s, transform .15s",
    }),
    letterActive: css({
      backgroundColor: primary,
      color: "#fff",
      transform: "scale(1.08)",
    }),
    bigLetter: css({
      zIndex: 3,
      position: "absolute",
      fontFamily: "Arial, sans-serif",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "rgba(0,0,0,0.55)",
      color: "#fff",
      fontSize: ".6rem",
      width: "1.4rem",
      height: "1.4rem",
      lineHeight: "1.4rem",
      textAlign: "center",
      borderRadius: ".24rem",
      pointerEvents: "none",
    }),
    original: css({
      height: "100%",
      backgroundColor: bgPage,
    }),
    top: css({
      padding: ".24rem .3rem",
      borderBottom: `1px solid ${border}`,
      "& > div": {
        height: ".72rem",
        backgroundColor: bgSubtle,
        padding: "0 .24rem",
        borderRadius: ".36rem",
      },
    }),
    icon: css({
      width: ".32rem",
      height: ".32rem",
      fill: textTertiary,
      marginRight: ".15rem",
      fontSize: 0,
      flexShrink: 0,
    }),
    input: css({
      flexGrow: 1,
      height: "100%",
      minWidth: 0,
      fontSize: ".28rem",
      lineHeight: ".72rem",
      color: textPrimary,
      fontFamily: "inherit",
      border: "none",
      outline: "none",
      backgroundColor: "transparent",
      padding: 0,
      "&::placeholder": {
        color: textTertiary,
        lineHeight: ".72rem",
      },
    }),
    exit: css({
      whiteSpace: "nowrap",
      marginLeft: ".2rem",
      lineHeight: ".72rem",
      fontSize: ".28rem",
      color: primary,
      cursor: "pointer",
      transition: "opacity .15s, color .15s",
      "&:active": {
        color: primaryActive,
        opacity: 0.75,
      },
    }),
    list: css({
      height: 0,
      flexGrow: 1,
      overflow: "auto",
      position: "relative",
      WebkitOverflowScrolling: "touch",
    }),
    locate: css({
      display: "flex",
      alignItems: "center",
      padding: ".2rem .23rem",
      borderBottom: `1px solid ${border}`,
      backgroundColor: bgPage,
      transition: "background-color .12s",
      "&:active": {
        backgroundColor: bgSubtle,
      },
    }),
    locateIcon: css({
      width: ".32rem",
      height: ".32rem",
      fill: primary,
      marginRight: ".16rem",
      fontSize: 0,
      flexShrink: 0,
    }),
    locateLabel: css({
      fontSize: ".24rem",
      color: textTertiary,
      marginRight: ".16rem",
    }),
    locateName: css({
      fontSize: ".24rem",
      color: primary,
    }),
    title: css({
      padding: ".08rem .3rem",
      fontSize: ".22rem",
      fontWeight: 600,
      color: textSecondary,
      letterSpacing: ".02rem",
      textTransform: "uppercase",
      backgroundColor: bgSubtle,
      position: "sticky",
      top: 0,
      zIndex: 1,
    }),
    item: css({
      padding: ".24rem .3rem",
      fontSize: ".3rem",
      color: textPrimary,
      borderBottom: `1px solid ${border}`,
      backgroundColor: bgPage,
      transition: "background-color .12s",
      "&:active": {
        backgroundColor: bgSubtle,
      },
    }),
    searchList: css({
      height: 0,
      flexGrow: 1,
      overflow: "auto",
      WebkitOverflowScrolling: "touch",
    }),
    empty: css({
      height: 0,
      flexGrow: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: textTertiary,
      fontSize: ".26rem",
    }),
  };
}

export const DEFAULT_PRIMARY = "#2f7dff";
