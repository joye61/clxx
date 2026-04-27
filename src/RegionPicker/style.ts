import { css, Interpolation, Theme } from "@emotion/react";
import { darken } from "../utils/color";
import { fontStack } from "../utils/theme";

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
  const sheetRadius = rounded ? ".24rem" : "0";
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
      height: ".92rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 .16rem",
      borderBottom: `1px solid ${border}`,
    }),
    title: css({
      flex: 1,
      textAlign: "center",
      fontSize: ".3rem",
      fontWeight: 600,
      color: textPrimary,
      letterSpacing: ".01rem",
    }),
    btn: css({
      minWidth: "1.1rem",
      padding: "0 .08rem",
      fontSize: ".28rem",
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
      height: ".8rem",
      padding: "0 .16rem",
      backgroundColor: bgSubtle,
      borderBottom: `1px solid ${border}`,
    }),
    tab: css({
      flex: 1,
      minWidth: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 .08rem",
      fontSize: ".26rem",
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
      fontWeight: 600,
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
    // 选项列表：固定高度避免跳变
    list: css({
      flexShrink: 0,
      height: "5.28rem",
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      overscrollBehavior: "contain",
      backgroundColor: bgPage,
    }),
    // 列表项：底部 hairline 分隔（CitySelect 风），按下浅灰底
    listItem: css({
      position: "relative",
      height: ".88rem",
      display: "flex",
      alignItems: "center",
      padding: "0 .3rem",
      fontSize: ".3rem",
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
      letterSpacing: ".01rem",
    }),
    listItemSelected: css({
      color: primary,
      fontWeight: 500,
    }),
    // 对勾
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
