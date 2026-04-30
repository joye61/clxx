import { css, keyframes, Interpolation, Theme } from "@emotion/react";
import { darken } from "../utils/color";
import { fontStack } from "../utils/theme";
import { r } from "../utils/rem";

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
  // 抬起 / 回弹的几何换算：
  // - pin 容器高 0.72rem，整体抬起幅度对应 pin 容器的 28%
  // - head 高度占容器 60%，上抬 28%/60% ≈ 46.67% 自身高度
  // - stem 高度占容器 37.5%，scaleY 起点 1，抬起后 (37.5%+28%)/37.5% ≈ 1.7467；
  //   stem 的 transform-origin 设在底部（即针尖处），保证 scaleY 改变时针尖不动
  // 这样「抬起」只让针头浮起、针体拉长，针尖始终钉在屏幕中心 = 地图中心，
  // 避免出现「拖动时看见的针尖指向点」与「松手后实际选中的中心点」错位。
  //
  // 弹簧关键帧（pin 高度相对幅度）：抬起 +28% → -5% → +4% → -2% → +1% → 0
  //   首次过冲从 4% 加大到 5%、衰减比按 ~1:0.8:0.5:0.2，更接近真实弹簧
  //   时段分布前重后轻（28% / 48% / 65% / 82%），让"砸下→第一次回弹"最显著，
  //   余下的小回弹快速收敛，配合 0.5s 总时长整体更轻快、更"脆"
  const pinHeadDropKf = keyframes({
    "0%": { transform: "translate(-50%, -46.67%)" },
    "28%": { transform: "translate(-50%, 8.33%)" },
    "48%": { transform: "translate(-50%, -6.67%)" },
    "65%": { transform: "translate(-50%, 3.33%)" },
    "82%": { transform: "translate(-50%, -1.67%)" },
    "100%": { transform: "translate(-50%, 0%)" },
  });
  const pinStemDropKf = keyframes({
    "0%": { transform: "translateX(-50%) scaleY(1.7467)" },
    "28%": { transform: "translateX(-50%) scaleY(0.8667)" },
    "48%": { transform: "translateX(-50%) scaleY(1.1067)" },
    "65%": { transform: "translateX(-50%) scaleY(0.9467)" },
    "82%": { transform: "translateX(-50%) scaleY(1.0267)" },
    "100%": { transform: "translateX(-50%) scaleY(1)" },
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

    // 居中、不动的定位 pin
    // 针尖在 wrapper 内部 y=95.5% 处（与原 SVG viewBox 中针尖 y=977.92/1024 一致），
    // 所以 translateY=-95.5% 才能让针尖与地图几何中心（用户当前位置 marker 中心）严格对齐
    // 注意：抬起 / 落下动画已迁移到子元素 head / stem 上，容器位置永远固定，
    // 这样针尖始终对准地图中心，避免「拖动时看到的针尖位置」与「松手后实际选中点」错位
    centerPin: css({
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -95.5%)",
      pointerEvents: "none",
      width: r(72),
      height: r(72),
      zIndex: 5,
    }),
    // pin 头部圆环：原 SVG viewBox 中外径 60%、环厚约外径的 30%
    // 以 border 模拟“甜甜圈”，中间镂空让针体在重叠区被环覆盖
    // 加一层细投影提升悬浮感，使 pin 在地图底图上有"贴近但漂浮"的层次
    centerPinHead: css({
      position: "absolute",
      top: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "60%",
      height: "60%",
      borderRadius: "50%",
      border: `${r(13)} solid ${primary}`,
      boxSizing: "border-box",
      boxShadow:
        "0 4px 10px rgba(0,0,0,0.18), 0 1px 2px rgba(0,0,0,0.08)",
      transition: "transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)",
      willChange: "transform",
    }),
    // 抬起：仅针头上移 46.67% 自身高度（= 28% pin 高度），针尖不动
    centerPinHeadLifted: css({
      transform: "translate(-50%, -46.67%)",
      transition: "transform 0.16s ease-out",
    }),
    // 落下 + 多次回弹：与 stem 同步播放
    centerPinHeadDrop: css({
      animation: `${pinHeadDropKf} 0.5s cubic-bezier(0.22, 0.61, 0.36, 1) 1`,
    }),
    // pin 针体：宽 5%、从 58% 处伸到 95.5% 处的细矩形，底部加轻微圆角对齐原 SVG 弧线
    // 与头部保持 ~2% 重叠，源序在头部之前，确保头部在重叠区盖住针体
    // transform-origin 设在底部（即针尖处），scaleY 改变时针尖始终钉在原位
    centerPinStem: css({
      position: "absolute",
      top: "58%",
      left: "50%",
      transform: "translateX(-50%)",
      transformOrigin: "50% 100%",
      width: "5%",
      height: "37.5%",
      backgroundColor: "#5D5D5D",
      borderBottomLeftRadius: "50% 8%",
      borderBottomRightRadius: "50% 8%",
      transition: "transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)",
      willChange: "transform",
    }),
    // 抬起：针体被纵向拉长到 1.7467 倍（= (37.5%+28%) / 37.5%），针尖端不动
    centerPinStemLifted: css({
      transform: "translateX(-50%) scaleY(1.7467)",
      transition: "transform 0.16s ease-out",
    }),
    // 落下 + 多次回弹：与 head 同步播放
    centerPinStemDrop: css({
      animation: `${pinStemDropKf} 0.5s cubic-bezier(0.22, 0.61, 0.36, 1) 1`,
    }),

    // 顶部一行：取消（左） / 确定（右）
    topBar: css({
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      padding: `calc(env(safe-area-inset-top, 0px) + ${r(28)}) ${r(28)} ${r(16)}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: r(16),
      zIndex: 6,
      pointerEvents: "none",
    }),
    // 取消：圆形图标按钮，配 CSS chevron-left；与 locateBtn 共享视觉语言
    cancelBtn: css({
      ...flatBase,
      pointerEvents: "auto",
      width: r(54),
      height: r(54),
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background-color .12s, transform .12s",
      "&:active": {
        backgroundColor: bgSubtle,
        transform: "scale(0.94)",
      },
    }),
    // 纯 CSS 画 chevron-left：两条相邻 border 旋转 -45°，避免再引一段 SVG path
    cancelBtnIcon: css({
      width: r(18),
      height: r(18),
      borderTop: `${r(5)} solid ${textPrimary}`,
      borderLeft: `${r(5)} solid ${textPrimary}`,
      borderRadius: r(2.5),
      transform: "rotate(-45deg)",
      // 视觉重心补偿：chevron 旋转后偏右，左移让光学上更居中
      marginLeft: r(4),
    }),
    // 确定：更醒目的主行动按钮，主色调阴影 + 按压缩放
    confirmBtn: css({
      pointerEvents: "auto",
      minWidth: r(88),
      height: r(54),
      lineHeight: r(54),
      padding: `0 ${r(24)}`,
      backgroundColor: primary,
      color: "#fff",
      fontSize: r(24),
      fontWeight: 600,
      letterSpacing: r(2),
      borderRadius: r(27),
      textAlign: "center",
      border: "none",
      // 主色 ~31% 透明的彩色阴影 + 1px 描边阴影，提升「浮起」与精致感
      // boxShadow: `0 5px 14px ${primary}50, 0 1px 2px rgba(0,0,0,0.08)`,
      boxShadow: "0 2px 8px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.06)",
      transition: "background-color .12s, transform .12s, box-shadow .12s",
      "&:active": {
        backgroundColor: primaryActive,
        transform: "scale(0.96)",
        boxShadow: `0 3px 9px ${primary}40, 0 1px 2px rgba(0,0,0,0.08)`,
      },
    }),
    confirmDisabled: css({
      opacity: 0.55,
      pointerEvents: "none",
    }),

    // 「回到当前位置」按钮：与 topBar 右边距对齐 (0.28rem)，上抬避开高德版权
    locateBtn: css({
      ...flatBase,
      position: "absolute",
      right: r(28),
      bottom: r(40),
      zIndex: 6,
      width: r(60),
      height: r(60),
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background-color .12s, transform .12s",
      "&:active": {
        backgroundColor: bgSubtle,
        transform: "scale(0.94)",
      },
    }),
    locateBtnIcon: css({
      width: r(30),
      height: r(30),
      fill: textPrimary,
      transition: "fill .12s",
    }),
    // 按钮内置 loading spinner：仅在 locateBtn 自身位置打转，不再用整屏 mask
    locateBtnSpinner: css({
      width: r(32),
      height: r(32),
      borderRadius: "50%",
      border: `${r(4)} solid rgba(0,0,0,0.12)`,
      borderTopColor: primary,
      animation: `${spinKf} 0.7s linear infinite`,
      boxSizing: "border-box",
    }),

    // 下半部分容器
    bottom: css({
      flex: 1,
      minHeight: 0,
      display: "flex",
      flexDirection: "column",
      backgroundColor: bgPage,
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
      padding: `${r(24)} ${r(30)}`,
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
      fontSize: r(30),
      color: textPrimary,
      lineHeight: 1.4,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    }),
    itemDesc: css({
      marginTop: r(6),
      fontSize: r(22),
      color: textSecondary,
      lineHeight: 1.4,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    }),
    // 选中态：标题用主色 + 加粗，跟右侧 itemCheck 钩选呼应。
    itemTitleActive: css({
      color: primary,
      fontWeight: 500,
    }),
    itemCheck: css({
      width: r(50),
      height: r(50),
      marginLeft: r(20),
      flexShrink: 0,
      fill: primary,
      alignSelf: "center",
    }),

    empty: css({
      padding: `${r(60)} 0`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: textTertiary,
      fontSize: r(26),
    }),
    listEnd: css({
      padding: `${r(24)} 0`,
      textAlign: "center",
      color: textTertiary,
      fontSize: r(22),
    }),

    // 定位中：地图层 —— 半透明白底 + 更柔的玻璃模糊 + 居中 spinner + 小号文字
    locatingMask: css({
      position: "absolute",
      inset: 0,
      backgroundColor: "rgba(255,255,255,0.62)",
      WebkitBackdropFilter: "blur(3px)",
      backdropFilter: "blur(3px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: r(18),
      color: textPrimary,
      fontSize: r(24),
      fontWeight: 500,
      letterSpacing: r(4),
      zIndex: 8,
    }),
    // 旋转的 spinner 圆环
    spinner: css({
      width: r(50),
      height: r(50),
      borderRadius: "50%",
      border: `${r(5)} solid rgba(0,0,0,0.08)`,
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
    // 底部容器需要相对定位，遮罩才能盖住
    bottomRelative: css({
      position: "relative",
    }),
  };
}
