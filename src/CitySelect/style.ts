import { css, Interpolation, Theme } from "@emotion/react";
import { darken } from "../utils/color";
import { fontStack } from "../utils/theme";
import { r } from "../utils/rem";

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
      right: r(12),
      transform: "translateY(-50%)",
      zIndex: 2,
      padding: `${r(10)} ${r(6)}`,
      borderRadius: r(30),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: r(2),
    }),
    letter: css({
      width: r(36),
      height: r(36),
      lineHeight: r(36),
      textAlign: "center",
      fontSize: r(22),
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
      fontSize: r(60),
      width: r(140),
      height: r(140),
      lineHeight: r(140),
      textAlign: "center",
      borderRadius: r(24),
      pointerEvents: "none",
    }),
    original: css({
      height: "100%",
      backgroundColor: bgPage,
    }),
    top: css({
      padding: `${r(24)} ${r(30)}`,
      borderBottom: `1px solid ${border}`,
      "& > div": {
        height: r(72),
        backgroundColor: bgSubtle,
        padding: `0 ${r(24)}`,
        borderRadius: r(36),
      },
    }),
    icon: css({
      width: r(32),
      height: r(32),
      fill: textTertiary,
      marginRight: r(15),
      fontSize: 0,
      flexShrink: 0,
    }),
    input: css({
      flexGrow: 1,
      height: "100%",
      minWidth: 0,
      fontSize: r(28),
      lineHeight: r(72),
      color: textPrimary,
      fontFamily: "inherit",
      border: "none",
      outline: "none",
      backgroundColor: "transparent",
      padding: 0,
      "&::placeholder": {
        color: textTertiary,
        lineHeight: r(72),
      },
    }),
    exit: css({
      whiteSpace: "nowrap",
      marginLeft: r(20),
      lineHeight: r(72),
      fontSize: r(28),
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
      padding: `${r(20)} ${r(23)}`,
      borderBottom: `1px solid ${border}`,
      backgroundColor: bgPage,
      transition: "background-color .12s",
      "&:active": {
        backgroundColor: bgSubtle,
      },
    }),
    locateIcon: css({
      width: r(32),
      height: r(32),
      fill: primary,
      marginRight: r(16),
      fontSize: 0,
      flexShrink: 0,
    }),
    locateLabel: css({
      fontSize: r(24),
      color: textTertiary,
      marginRight: r(16),
    }),
    locateName: css({
      fontSize: r(24),
      color: primary,
    }),
    title: css({
      padding: `${r(8)} ${r(30)}`,
      fontSize: r(22),
      fontWeight: 600,
      color: textSecondary,
      letterSpacing: r(2),
      textTransform: "uppercase",
      backgroundColor: bgSubtle,
      position: "sticky",
      top: 0,
      zIndex: 1,
    }),
    item: css({
      padding: `${r(24)} ${r(30)}`,
      fontSize: r(30),
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
      fontSize: r(26),
    }),
  };
}

export const DEFAULT_PRIMARY = "#2f7dff";
