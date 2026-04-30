import { css, Interpolation, Theme } from "@emotion/react";
import { darken } from "../utils/color";
import { fontStack } from "../utils/theme";
import { r } from "../utils/rem";

// 与 CitySelect 一致的设计变量（带线条风格）
const textPrimary = "#1f2328";
const textSecondary = "#6b7280";
const textTertiary = "#9ca3af";
const bgPage = "#ffffff";
const bgSubtle = "#f5f6f8";
const border = "#e5e7eb";

export const DEFAULT_PRIMARY = "#2f7dff";

export type RegionPickerStyle = Record<string, Interpolation<Theme>>;

export function createStyle(
  primary: string,
  rounded: boolean = true,
): RegionPickerStyle {
  const primaryActive = darken(primary, 0.15);
  const sheetRadius = rounded ? r(24) : "0";
  return {
    // 内容容器：动画/遮罩/全屏由 Dialog 提供，这里只保留视觉与排版
    sheet: css({
      width: "100%",
      backgroundColor: bgPage,
      borderTopLeftRadius: sheetRadius,
      borderTopRightRadius: sheetRadius,
      display: "flex",
      flexDirection: "column",
      maxHeight: "80vh",
      overflow: "hidden",
      userSelect: "none",
      color: textPrimary,
      fontFamily: fontStack,
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    }),
    // 标题栏：底部 hairline 与列表区分；按钮中等字重
    header: css({
      flexShrink: 0,
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
    btnConfirmDisabled: css({
      color: textTertiary,
      cursor: "not-allowed",
      pointerEvents: "none",
      fontWeight: 500,
      "&:active": { opacity: 1, color: textTertiary },
    }),
    // tabs 行：浅灰底色（与 CitySelect 字母分组标题色一致），激活态细下划线
    tabs: css({
      flexShrink: 0,
      display: "flex",
      alignItems: "stretch",
      height: r(80),
      padding: `0 ${r(16)}`,
      backgroundColor: bgSubtle,
      borderBottom: `1px solid ${border}`,
    }),
    tab: css({
      flex: 1,
      minWidth: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: `0 ${r(8)}`,
      fontSize: r(26),
      color: textSecondary,
      position: "relative",
      cursor: "pointer",
      transition: "color .2s ease",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      letterSpacing: r(1),
    }),
    tabPlaceholder: css({
      color: textTertiary,
    }),
    tabActive: css({
      color: primary,
      fontWeight: 600,
      "&::after": {
        content: '""',
        position: "absolute",
        left: "50%",
        bottom: r(6),
        transform: "translateX(-50%)",
        width: r(32),
        height: r(4),
        backgroundColor: primary,
        borderRadius: r(2),
      },
    }),
    // 选项列表：固定高度避免跳变
    list: css({
      flexShrink: 0,
      height: r(528),
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      overscrollBehavior: "contain",
      backgroundColor: bgPage,
    }),
    // 列表项：底部 hairline 分隔（CitySelect 风），按下浅灰底
    listItem: css({
      position: "relative",
      height: r(88),
      display: "flex",
      alignItems: "center",
      padding: `0 ${r(30)}`,
      fontSize: r(30),
      color: textPrimary,
      backgroundColor: bgPage,
      borderBottom: `1px solid ${border}`,
      transition: "background-color .12s",
      "&:active": {
        backgroundColor: bgSubtle,
      },
    }),
    listItemLabel: css({
      flex: 1,
      minWidth: 0,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      letterSpacing: r(1),
    }),
    listItemSelected: css({
      color: primary,
      fontWeight: 500,
    }),
    // 对勾
    checkIcon: css({
      width: r(32),
      height: r(32),
      flexShrink: 0,
      marginLeft: r(16),
      position: "relative",
      "&::after": {
        content: '""',
        position: "absolute",
        left: r(6),
        top: r(4),
        width: r(10),
        height: r(20),
        border: `solid ${primary}`,
        borderWidth: `0 ${r(3)} ${r(3)} 0`,
        transform: "rotate(45deg)",
      },
    }),
    // 空数据占位
    empty: css({
      padding: `${r(60)} 0`,
      textAlign: "center",
      fontSize: r(26),
      color: textTertiary,
    }),
  };
}
