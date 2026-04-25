import { Interpolation, Theme } from "@emotion/react";
import { fontStack } from "../utils/theme";

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
    borderRadius: ".28rem",
    width: (750 * 0.78) / 100 + "rem",
    fontFamily: fontStack,
    color: textPrimary,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    boxShadow: "0 .2rem .6rem rgba(0,0,0,.18)",
  },

  content: {
    position: "relative",
    paddingTop: ".4rem",
    paddingBottom: ".4rem",
    paddingLeft: ".36rem",
    paddingRight: ".36rem",
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
    fontSize: ".34rem",
    fontWeight: 600,
    letterSpacing: ".01rem",
  },
  desc: {
    textAlign: "center",
    lineHeight: 1.55,
    color: textSecondary,
    fontSize: ".28rem",
    marginTop: ".18rem",
    wordBreak: "break-word",
  },
  btnBox: {
    position: "relative",
    height: ".92rem",
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
    fontSize: ".32rem",
    fontWeight: 500,
    letterSpacing: ".01rem",
    cursor: "pointer",
    transition: "background-color .12s",
  },
  btnConfirm: {
    fontWeight: 600,
  },
};
