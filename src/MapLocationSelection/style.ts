import { css, keyframes, Interpolation, Theme } from "@emotion/react";
import { darken } from "../utils/color";
import { fontStack } from "../utils/theme";

// 设计变量（与 CitySelect 保持一致）
const textPrimary = "#1f2328";
const textSecondary = "#6b7280";
const textTertiary = "#9ca3af";
const bgPage = "#ffffff";
const bgSubtle = "#f5f6f8";
const border = "#e5e7eb";

export type MapLocStyle = Record<string, Interpolation<Theme>>;

export const DEFAULT_PRIMARY = "#2f7dff";

// 浮层按钮基础样式（白底 + 柔和阴影，叠加在地图上保证可读，贴近 CitySelect 的扫平质感）
const flatBase = {
  backgroundColor: bgPage,
  color: textPrimary,
  border: "none",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.06)",
};

export function createStyle(primary: string): MapLocStyle {
  const primaryActive = darken(primary, 0.15);
  // 定位完成/地图停下时的“落下 + 多次回弹”动画（仿微信发送位置）
  // 平衡点为 translate(-50%, -92%)，与 centerPinLifted 的 -120% 无缝衔接，避免跳跳。
  // 动画思路：从抬起位置下落→轻轻压低→小跳→再微跳→稳定。
  const pinDropKf = keyframes({
    "0%": { transform: "translate(-50%, -120%)" },
    "40%": { transform: "translate(-50%, -88%)" },
    "60%": { transform: "translate(-50%, -96%)" },
    "78%": { transform: "translate(-50%, -90%)" },
    "90%": { transform: "translate(-50%, -93%)" },
    "100%": { transform: "translate(-50%, -92%)" },
  });
  // 定位中 spinner 的旋转动画
  const spinKf = keyframes({
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  });
  return {
    inner: css({
      position: "relative",
      width: "100%",
      height: "100%",
      backgroundColor: bgPage,
      display: "flex",
      flexDirection: "column",
      color: textPrimary,
      fontFamily: fontStack,
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      userSelect: "none",
      overflow: "hidden",
    }),

    // 顶部地图区域
    mapWrap: css({
      position: "relative",
      flex: "0 0 55%",
      width: "100%",
      backgroundColor: "#e8eaef",
      overflow: "hidden",
    }),
    mapContainer: css({
      width: "100%",
      height: "100%",
    }),

    // 居中、不动的定位 pin（icon.txt 第一个 svg）
    // viewBox 0..1024，pin 尖端约在 (512, 947)，translate 让尖端落到地图中心
    centerPin: css({
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -92%)",
      transformOrigin: "50% 100%",
      // 拖动时上抬，停止后回落（带轻微弹性）
      transition: "transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
      pointerEvents: "none",
      width: "0.72rem",
      height: "0.72rem",
      zIndex: 5,
      // filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.28))",
      willChange: "transform",
    }),
    // 拖动 / 程序化移动时：图钉抬起
    centerPinLifted: css({
      transform: "translate(-50%, -120%)",
      transition: "transform 0.18s ease-out",
    }),
    // 定位完成或地图停下时：触发一次“落下 + 多次回弹”动画
    centerPinDrop: css({
      animation: `${pinDropKf} 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) 1`,
    }),

    // 顶部一行：取消（左） / 切换城市（中） / 确定（右）
    topBar: css({
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      padding: "calc(env(safe-area-inset-top, 0px) + 0.24rem) 0.24rem 0.16rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "0.16rem",
      zIndex: 6,
      pointerEvents: "none",
    }),
    cancelBtn: css({
      ...flatBase,
      pointerEvents: "auto",
      minWidth: "0.92rem",
      height: "0.56rem",
      lineHeight: "0.54rem",
      padding: "0 0.18rem",
      fontSize: "0.24rem",
      borderRadius: "0.28rem",
      textAlign: "center",
      transition: "background-color .12s, opacity .12s",
      "&:active": {
        backgroundColor: bgSubtle,
        opacity: 0.85,
      },
    }),
    confirmBtn: css({
      pointerEvents: "auto",
      minWidth: "0.92rem",
      height: "0.56rem",
      lineHeight: "0.56rem",
      padding: "0 0.2rem",
      backgroundColor: primary,
      color: "#fff",
      fontSize: "0.24rem",
      fontWeight: 500,
      borderRadius: "0.28rem",
      textAlign: "center",
      border: "none",
      boxShadow: "0 2px 8px rgba(0,0,0,0.12), 0 0 1px rgba(0,0,0,0.06)",
      transition: "background-color .12s, opacity .12s",
      "&:active": {
        backgroundColor: primaryActive,
        opacity: 0.9,
      },
    }),
    confirmDisabled: css({
      opacity: 0.55,
      pointerEvents: "none",
    }),

    // 中间的切换城市按钮（与 cancelBtn / confirmBtn 同高）
    cityBar: css({
      // 保留以防外部引用，实际不再单独使用
      display: "none",
    }),
    cityBtn: css({
      ...flatBase,
      pointerEvents: "auto",
      maxWidth: "3rem",
      height: "0.56rem",
      padding: "0 0.1rem 0 0.18rem",
      fontSize: "0.24rem",
      borderRadius: "0.28rem",
      display: "inline-flex",
      alignItems: "center",
      // gap: "0.1rem",
      transition: "background-color .12s, opacity .12s",
      "&:active": {
        backgroundColor: bgSubtle,
        opacity: 0.85,
      },
    }),
    cityBtnIcon: css({
      width: "0.24rem",
      height: "0.24rem",
      fill: primary,
      flexShrink: 0,
    }),
    cityBtnText: css({
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      maxWidth: "1.6rem",
    }),
    cityBtnArrow: css({
      width: "0.28rem",
      height: "0.28rem",
      fill: textTertiary,
      flexShrink: 0,
    }),

    // 「回到当前位置」按钮：浮动在地图右侧，与 topBar 右侧边距对齐（0.24rem）
    locateBtn: css({
      ...flatBase,
      position: "absolute",
      right: "0.24rem",
      bottom: "0.24rem",
      zIndex: 6,
      width: "0.6rem",
      height: "0.6rem",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background-color .12s, opacity .12s",
      "&:active": {
        backgroundColor: bgSubtle,
        opacity: 0.85,
      },
    }),
    locateBtnIcon: css({
      width: "0.32rem",
      height: "0.32rem",
      fill: textPrimary,
    }),

    // 下半部分容器
    bottom: css({
      flex: 1,
      minHeight: 0,
      display: "flex",
      flexDirection: "column",
      backgroundColor: bgPage,
    }),
    searchBox: css({
      padding: "0.24rem 0.3rem",
      borderBottom: `1px solid ${border}`,
    }),
    searchInner: css({
      display: "flex",
      alignItems: "center",
      height: "0.72rem",
      backgroundColor: bgSubtle,
      borderRadius: "0.36rem",
      padding: "0 0.24rem",
    }),
    searchIcon: css({
      width: "0.32rem",
      height: "0.32rem",
      fill: textTertiary,
      marginRight: "0.15rem",
      flexShrink: 0,
    }),
    searchInput: css({
      flex: 1,
      minWidth: 0,
      height: "100%",
      fontSize: "0.28rem",
      lineHeight: "0.72rem",
      color: textPrimary,
      fontFamily: "inherit",
      border: "none",
      outline: "none",
      backgroundColor: "transparent",
      padding: 0,
      "&::placeholder": {
        color: textTertiary,
      },
    }),
    searchClear: css({
      width: "0.34rem",
      height: "0.34rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      cursor: "pointer",
    }),
    searchClearIcon: css({
      width: "0.34rem",
      height: "0.34rem",
      display: "block",
    }),

    // 列表区域容器（高度 = bottom 剩余空间）
    listArea: css({
      flex: 1,
      minHeight: 0,
    }),
    item: css({
      position: "relative",
      display: "flex",
      alignItems: "flex-start",
      padding: "0.24rem 0.3rem",
      borderBottom: `1px solid ${border}`,
      backgroundColor: bgPage,
      transition: "background-color .12s",
      "&:active": {
        backgroundColor: bgSubtle,
      },
    }),
    itemBody: css({
      flex: 1,
      minWidth: 0,
    }),
    itemTitle: css({
      fontSize: "0.3rem",
      color: textPrimary,
      lineHeight: 1.4,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    }),
    itemDesc: css({
      marginTop: "0.06rem",
      fontSize: "0.22rem",
      color: textSecondary,
      lineHeight: 1.4,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    }),
    itemCheck: css({
      width: "0.5rem",
      height: "0.5rem",
      marginLeft: "0.2rem",
      flexShrink: 0,
      fill: primary,
      alignSelf: "center",
    }),
    itemTitleActive: css({
      color: primary,
      fontWeight: 500,
    }),

    empty: css({
      padding: "0.6rem 0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: textTertiary,
      fontSize: "0.26rem",
    }),
    listEnd: css({
      padding: "0.24rem 0",
      textAlign: "center",
      color: textTertiary,
      fontSize: "0.22rem",
    }),

    // 定位中：地图层 —— 半透明白色背景 + 居中 spinner + 小号文字
    locatingMask: css({
      position: "absolute",
      inset: 0,
      backgroundColor: "rgba(255,255,255,0.55)",
      WebkitBackdropFilter: "blur(1px)",
      backdropFilter: "blur(1px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.14rem",
      color: textSecondary,
      fontSize: "0.22rem",
      letterSpacing: "0.02rem",
      zIndex: 8,
    }),
    // 旋转的 spinner 圆环
    spinner: css({
      width: "0.44rem",
      height: "0.44rem",
      borderRadius: "50%",
      border: "0.04rem solid rgba(0,0,0,0.08)",
      borderTopColor: primary,
      animation: `${spinKf} 0.8s linear infinite`,
      boxSizing: "border-box",
    }),
    // 定位中：底部搜索 + 列表的锁定遮罩（透明，仅拦截点击）
    bottomLockedMask: css({
      position: "absolute",
      inset: 0,
      backgroundColor: "rgba(255,255,255,0.45)",
      zIndex: 9,
      cursor: "not-allowed",
    }),
    // 定位中的搜索框视觉禁用（输入框本身已 disabled，这里降低色阶）
    searchDisabled: css({
      opacity: 0.55,
    }),
    // 底部容器需要相对定位，遮罩才能盖住
    bottomRelative: css({
      position: "relative",
    }),
  };
}
