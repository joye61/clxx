import { Interpolation, Theme } from "@emotion/react";
import { fontStack } from "../utils/theme";
import { r } from "../utils/rem";

// 1px 硬边框（高清屏 hairline）
const hairline = 1 / (typeof window !== "undefined" ? window.devicePixelRatio : 1);

// iOS 风色板
const textPrimary = "#000000";
const textSecondary = "#3c3c43";
const separator = "rgba(60,60,67,.29)"; // iOS opaqueSeparator

export const style: Record<string, Interpolation<Theme>> = {
  container: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#ffffff",
    borderRadius: r(28),
    width: r(750 * 0.78),
    fontFamily: fontStack,
    color: textPrimary,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    boxShadow: `0 ${r(20)} ${r(60)} rgba(0,0,0,.18)`,
  },

  content: {
    position: "relative",
    paddingTop: r(40),
    paddingBottom: r(40),
    paddingLeft: r(36),
    paddingRight: r(36),
    "&:after,&::after": {
      content: "''",
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "1px",
      backgroundColor: separator,
      transform: `scale(1, ${hairline})`,
      transformOrigin: "0 100%",
    },
  },
  title: {
    textAlign: "center",
    lineHeight: 1.45,
    color: textPrimary,
    fontSize: r(34),
    fontWeight: 600,
    letterSpacing: r(1),
  },
  desc: {
    textAlign: "center",
    lineHeight: 1.55,
    color: textSecondary,
    fontSize: r(28),
    marginTop: r(18),
    wordBreak: "break-word",
  },
  btnBox: {
    position: "relative",
    height: r(92),
  },
  btnBoxWithCancel: {
    "&:after,&::after": {
      content: "''",
      position: "absolute",
      top: 0,
      bottom: 0,
      left: "50%",
      marginLeft: "-.5px",
      width: "1px",
      backgroundColor: separator,
      transform: `scale(${hairline}, 1)`,
      transformOrigin: "0 0",
    },
  },
  btn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    fontSize: r(32),
    fontWeight: 500,
    letterSpacing: r(1),
    cursor: "pointer",
    transition: "background-color .12s",
  },
  btnConfirm: {
    fontWeight: 600,
  },
};
