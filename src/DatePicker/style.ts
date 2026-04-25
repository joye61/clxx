import { css, Interpolation, Theme } from "@emotion/react";
import { darken } from "../utils/color";
import { fontStack, numberFontStack } from "../utils/theme";

// iOS 风格设计变量
const textPrimary = "#000000";
const textSecondary = "#3c3c43"; // iOS secondaryLabel
const textTertiary = "#8e8e93"; // iOS tertiaryLabel
const bgPage = "#ffffff";
const bgSubtle = "rgba(120,120,128,.12)"; // iOS quaternary fill

// 可见行数 = 5，单元高度 = .8rem
export const ITEM_HEIGHT_REM = 0.8;
export const VISIBLE_ROWS = 5;

export type DatePickerStyle = Record<string, Interpolation<Theme>>;

export function createStyle(
  primary: string,
  rounded: boolean = true,
): DatePickerStyle {
  const primaryActive = darken(primary, 0.15);
  const sheetRadius = rounded ? ".28rem" : "0";
  const indicatorRadius = rounded ? ".12rem" : "0";
  return {
    // 内容容器：动画/全屏/居中由 Dialog 提供，这里只保留视觉与排版
    sheet: css({
      width: "100%",
      backgroundColor: bgPage,
      borderTopLeftRadius: sheetRadius,
      borderTopRightRadius: sheetRadius,
      overflow: "hidden",
      userSelect: "none",
      color: textPrimary,
      fontFamily: fontStack,
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    }),
    // iOS 风标题栏：底部 hairline 与下方 body 做轻量区块分隔
    header: css({
      height: ".92rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 .16rem",
      borderBottom: "1px solid rgba(60,60,67,.18)",
    }),
    title: css({
      flex: 1,
      textAlign: "center",
      fontSize: ".32rem",
      fontWeight: 600,
      color: textPrimary,
      letterSpacing: ".01rem",
    }),
    btn: css({
      minWidth: "1.1rem",
      padding: "0 .08rem",
      fontSize: ".3rem",
      fontWeight: 400,
      lineHeight: ".92rem",
      cursor: "pointer",
      transition: "opacity .15s, color .15s",
    }),
    btnCancel: css({
      textAlign: "left",
      color: textSecondary,
      "&:active": { opacity: 0.55 },
    }),
    btnConfirm: css({
      textAlign: "right",
      fontWeight: 600,
      color: primary,
      "&:active": { color: primaryActive, opacity: 0.65 },
    }),
    body: css({
      position: "relative",
      display: "flex",
      height: `${ITEM_HEIGHT_REM * VISIBLE_ROWS}rem`,
      padding: "0 .16rem .12rem",
    }),
    // iOS 风选中背景：柔和的 quaternary fill、充足圆角
    indicator: css({
      position: "absolute",
      left: ".16rem",
      right: ".16rem",
      top: `${ITEM_HEIGHT_REM * 2}rem`,
      height: `${ITEM_HEIGHT_REM}rem`,
      pointerEvents: "none",
      backgroundColor: bgSubtle,
      borderRadius: indicatorRadius,
    }),
    column: css({
      position: "relative",
      flex: 1,
      minWidth: 0,
      height: "100%",
      overflow: "hidden",
      touchAction: "none",
      // 自管理手势，禁用浏览器原生选中/拖拽
      userSelect: "none",
      WebkitUserSelect: "none",
    }),
    // 内层位移容器：transform translateY(-offset) 实现"滚动"
    columnInner: css({
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      willChange: "transform",
    }),
    item: css({
      height: `${ITEM_HEIGHT_REM}rem`,
      lineHeight: `${ITEM_HEIGHT_REM}rem`,
      fontSize: ".32rem",
      fontWeight: 400,
      fontFamily: numberFontStack,
      fontVariantNumeric: "tabular-nums",
      letterSpacing: ".01rem",
      textAlign: "center",
      color: textTertiary,
      transition: "color .18s ease",
    }),
    itemActive: css({
      color: textPrimary,
      fontWeight: 500,
    }),
    spacer: css({
      height: `${ITEM_HEIGHT_REM * 2}rem`,
      pointerEvents: "none",
    }),
  };
}

export const DEFAULT_PRIMARY = "#2f7dff";
