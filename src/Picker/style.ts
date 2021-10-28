import { Interpolation, Theme } from "@emotion/react";
import { adaptive } from "../utils/cssUtil";

export const tinyLine: Interpolation<Theme> = {
  "&:after,&::after": {
    content: "''",
    position: "absolute",
    left: 0,
    right: 0,
    height: "1px",
    backgroundColor: "#c0c0c0",
    transform: `scale(1, ${1 / window.devicePixelRatio})`,
  },
};

// 标题栏和每个选项通用的高度
const itemHeight = 90;

export const style: Record<string, Interpolation<Theme>> = {
  container: [
    {
      backgroundColor: "#fff",
      overflow: "hidden",
      position: "relative",
    },
    adaptive({
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    }),
  ],
  header: [
    {
      position: "relative",
      backgroundColor: "#fafafa",
      "&:after,&::after": {
        bottom: 0,
      },
    },
    tinyLine,
    adaptive({
      height: itemHeight,
    }),
  ],
  title: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1,
  },
  titleLabel: [
    {
      color: "#666",
      lineHeight: 1,
    },
    adaptive({
      fontSize: 20,
      marginBottom: 5,
    }),
  ],
  titleContent: [
    {
      color: "#333",
      lineHeight: 1,
    },
    adaptive({
      fontSize: 28,
    }),
  ],

  btnBox: {
    zIndex: 2,
  },
  btn: [
    { textAlign: "center", lineHeight: 2 },
    adaptive({
      width: 120,
      fontSize: 32,
    }),
  ],
  btnCancel: {
    color: "#666",
  },
  btnConfirm: {
    color: "#007afe",
  },

  body: {
    overflow: "hidden",
    position: "relative",
  },
  swiper: [
    adaptive({ height: itemHeight * 5, fontSize: 32 }),
    {
      ".swiper-slide": {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
    },
  ],
  mask: [
    {
      position: "absolute",
      left: 0,
      width: "100%",
      zIndex: 2,
    },
    tinyLine,
    adaptive({
      height: itemHeight * 2,
    }),
  ],
  maskTop: {
    top: 0,
    backgroundImage: "linear-gradient(180deg, #fefefe, transparent)",
    "&:after,&::after": {
      bottom: 0,
    },
  },
  maskBottom: {
    backgroundImage: "linear-gradient(0deg, #fefefe, transparent)",
    bottom: 0,
    "&:after,&::after": {
      top: 0,
    },
  },
};
