import { css, Interpolation, Theme } from "@emotion/react";

// 设计变量（除 primary 外集中管理）
const textPrimary = "#1f2328";
const textSecondary = "#6b7280";
const textTertiary = "#9ca3af";
const bgPage = "#ffffff";
const bgSubtle = "#f5f6f8";
const border = "#e5e7eb";
const fontStack =
  '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';

// 将 #rrggbb 颜色按比例变暗，用于派生 primaryActive
function darken(hex: string, amount: number): string {
  const m = hex.replace("#", "");
  if (m.length !== 6) return hex;
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  const f = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v * (1 - amount))));
  const toHex = (v: number) => f(v).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export type CitySelectStyle = Record<string, Interpolation<Theme>>;

// 根据 primary 色值生成一整套样式；primaryActive 由 primary 派生
export function createStyle(primary: string): CitySelectStyle {
  const primaryActive = darken(primary, 0.15);
  return {
    container: css({
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 9999,
      overflow: "hidden",
      userSelect: "none",
      color: textPrimary,
      fontFamily: fontStack,
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    }),
    inner: css({
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: bgPage,
      transition: "transform .3s cubic-bezier(.22,.61,.36,1)",
      willChange: "transform",
    }),
    innerEnter: css({
      transform: "translateX(100%)",
    }),
    innerActive: css({
      transform: "translateX(0)",
    }),
    innerExit: css({
      transform: "translateX(100%)",
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
      backgroundColor: "rgba(17,24,39,0.6)",
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
