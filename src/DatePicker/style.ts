import { css, Interpolation, Theme } from "@emotion/react";
import { darken } from "../utils/color";
import { fontStack, numberFontStack } from "../utils/theme";
import { r } from "../utils/rem";

// 与 CitySelect 一致的设计变量（带线条风格）
const textPrimary = "#1f2328";
const textSecondary = "#6b7280";
const textTertiary = "#9ca3af";
const bgPage = "#ffffff";
const bgSubtle = "#f5f6f8";
const border = "#e5e7eb";

// 可见行数 = 5，单元高度 = 80px @ 750 设计稿
export const ITEM_HEIGHT_PX = 80;
export const VISIBLE_ROWS = 5;

export type DatePickerStyle = Record<string, Interpolation<Theme>>;

export function createStyle(
  primary: string,
  rounded: boolean = true,
): DatePickerStyle {
  const primaryActive = darken(primary, 0.15);
  const sheetRadius = rounded ? r(24) : "0";
  const indicatorRadius = rounded ? r(12) : "0";
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
    // 标题栏：底部 hairline 与 body 区分
    header: css({
      height: r(92),
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: `0 ${r(16)}`,
      borderBottom: `1px solid ${border}`,
    }),
    title: css({
      flex: 1,
      textAlign: "center",
      fontSize: r(30),
      fontWeight: 600,
      color: textPrimary,
      letterSpacing: r(1),
    }),
    btn: css({
      minWidth: r(110),
      padding: `0 ${r(8)}`,
      fontSize: r(28),
      fontWeight: 400,
      lineHeight: r(92),
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
      fontWeight: 500,
      color: primary,
      "&:active": { color: primaryActive, opacity: 0.65 },
    }),
    body: css({
      position: "relative",
      display: "flex",
      height: r(ITEM_HEIGHT_PX * VISIBLE_ROWS),
      padding: `0 ${r(16)} ${r(12)}`,
    }),
    // 选中条：浅灰底 + 上下 hairline，与 CitySelect 列表观感一致
    indicator: css({
      position: "absolute",
      left: r(16),
      right: r(16),
      top: r(ITEM_HEIGHT_PX * 2),
      height: r(ITEM_HEIGHT_PX),
      pointerEvents: "none",
      backgroundColor: bgSubtle,
      borderTop: `1px solid ${border}`,
      borderBottom: `1px solid ${border}`,
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
      height: r(ITEM_HEIGHT_PX),
      lineHeight: r(ITEM_HEIGHT_PX),
      fontSize: r(32),
      fontWeight: 400,
      fontFamily: numberFontStack,
      fontVariantNumeric: "tabular-nums",
      letterSpacing: r(1),
      textAlign: "center",
      color: textTertiary,
      transition: "color .18s ease",
    }),
    itemActive: css({
      color: primary,
      fontWeight: 600,
    }),
    spacer: css({
      height: r(ITEM_HEIGHT_PX * 2),
      pointerEvents: "none",
    }),
  };
}

export const DEFAULT_PRIMARY = "#2f7dff";
