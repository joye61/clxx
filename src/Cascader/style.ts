import { Theme } from "@emotion/react";
import { Interpolation } from "@emotion/serialize";
import { adaptive } from "../utils/cssUtil";

export const tinyLine: Interpolation<Theme> = {
  "&:after,&::after": {
    content: "''",
    position: "absolute",
    left: 0,
    right: 0,
    height: "1px",
    backgroundColor: "#c0c0c0",
    transform: `scale(1, ${1 / window.devicePixelRatio})`, // todo
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
  title: [
    {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%,-50%)",
    },
    adaptive({
      fontSize: 28,
    }),
  ],
  btn: [
    {
      textAlign: "center",
    },
    adaptive({
      fontSize: 32,
      minWidth: 120,
    }),
  ],
  btnCancel: {
    color: "#666",
  },
  btnConfirm: {
    color: "#007afe",
  },
  Columns: [],
  swiper: [
    {
      position: "relative",
      overflow: "hidden",
      flex: "1 1 0",
    },
    adaptive({
      height: itemHeight * 5,
    }),
  ],
  mask: [
    {
      position: "absolute",
      width: "100%",
      zIndex: 2,
      left: 0,
    },
    tinyLine,
    adaptive({
      height: itemHeight * 2,
    }),
  ],
  maskTop: [
    {
      top: 0,
      background: "linear-gradient(#fefefe, transparent)",
      "&:after,&::after": {
        bottom: 0,
      },
    },
  ],
  maskBottom: [
    {
      bottom: 0,
      background: "linear-gradient(transparent, #fefefe)",
      "&:after,&::after": {
        top: 0,
      },
    },
  ],
};
