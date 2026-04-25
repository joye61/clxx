import { css, Interpolation, Theme } from "@emotion/react";
import { darken } from "../utils/color";
import { fontStack } from "../utils/theme";

// iOS 风格设计变量
const textPrimary = "#000000";
const textSecondary = "#3c3c43"; // iOS secondaryLabel
const textTertiary = "#8e8e93"; // iOS tertiaryLabel / placeholder
const bgPage = "#ffffff";
const bgSubtle = "rgba(0,0,0,.04)"; // 按下态浅灰

export const DEFAULT_PRIMARY = "#2f7dff";

export type RegionPickerStyle = Record<string, Interpolation<Theme>>;

export function createStyle(
  primary: string,
  rounded: boolean = true,
): RegionPickerStyle {
  const primaryActive = darken(primary, 0.15);
  const sheetRadius = rounded ? ".28rem" : "0";
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
    // iOS 风标题栏：无底边框，标题加粗居中，左右按钮都用主色
    header: css({
      flexShrink: 0,
      height: ".92rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 .16rem",
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
    btnConfirmDisabled: css({
      color: textTertiary,
      cursor: "not-allowed",
      pointerEvents: "none",
      fontWeight: 600,
      "&:active": { opacity: 1, color: textTertiary },
    }),
    // tabs 行：轻量化，激活态用细下划线提示；底部加 hairline 分隔下方列表
    tabs: css({
      flexShrink: 0,
      display: "flex",
      alignItems: "stretch",
      height: ".8rem",
      padding: "0 .16rem",
      borderBottom: "1px solid rgba(60,60,67,.18)",
    }),
    tab: css({
      flex: 1,
      minWidth: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 .08rem",
      fontSize: ".28rem",
      color: textSecondary,
      position: "relative",
      cursor: "pointer",
      transition: "color .2s ease",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      letterSpacing: ".01rem",
    }),
    tabPlaceholder: css({
      color: textTertiary,
    }),
    tabActive: css({
      color: primary,
      fontWeight: 500,
      "&::after": {
        content: '""',
        position: "absolute",
        left: "50%",
        bottom: ".06rem",
        transform: "translateX(-50%)",
        width: ".32rem",
        height: ".04rem",
        backgroundColor: primary,
        borderRadius: ".02rem",
      },
    }),
    // 选项列表（固定高度，避免跳变；6 行 × .88rem = 5.28rem，整体更紧凑）
    list: css({
      flexShrink: 0,
      height: "5.28rem",
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      overscrollBehavior: "contain",
      backgroundColor: bgPage,
      paddingBottom: ".12rem",
    }),
    // iOS 风列表项：无分隔线，仅按下态浅灰底
    listItem: css({
      position: "relative",
      height: ".88rem",
      display: "flex",
      alignItems: "center",
      padding: "0 .32rem",
      fontSize: ".3rem",
      color: textPrimary,
      transition: "background-color .15s",
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
      letterSpacing: ".01rem",
    }),
    listItemSelected: css({
      color: primary,
      fontWeight: 500,
    }),
    // iOS 风对勾（SF Symbol checkmark 风格）
    checkIcon: css({
      width: ".32rem",
      height: ".32rem",
      flexShrink: 0,
      marginLeft: ".16rem",
      position: "relative",
      "&::after": {
        content: '""',
        position: "absolute",
        left: ".06rem",
        top: ".04rem",
        width: ".1rem",
        height: ".2rem",
        border: `solid ${primary}`,
        borderWidth: "0 .03rem .03rem 0",
        transform: "rotate(45deg)",
      },
    }),
    // 空数据占位
    empty: css({
      padding: ".6rem 0",
      textAlign: "center",
      fontSize: ".26rem",
      color: textTertiary,
    }),
  };
}
