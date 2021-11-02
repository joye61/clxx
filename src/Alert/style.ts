import { Interpolation, Theme } from "@emotion/react";
import { adaptive } from "../utils/cssUtil";

export const style: Record<string, Interpolation<Theme>> = {
  container: [
    {
      position: "relative",
      overflow: "hidden",
      backgroundColor: "#fff",
    },
    adaptive({
      borderRadius: 16,
      width: 750 * 0.84,
    }),
  ],

  content: {
    position: "relative",
    "&:after,&::after": {
      content: "''",
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "1px",
      backgroundColor: "#c0c0c0",
      transform: `scale(1, ${1 / window.devicePixelRatio})`,
    },
  },
  title: [
    {
      textAlign: "center",
      lineHeight: 1.4,
      color: "#000",
    },
    adaptive({
      paddingTop: 50,
      paddingLeft: 40,
      paddingRight: 40,
      paddingBottom: 50,
      fontSize: 33,
    }),
  ],
  desc: [
    {
      textAlign: "center",
      lineHeight: 1.4,
      color: "#666",
    },
    adaptive({
      paddingTop: 20,
      paddingLeft: 40,
      paddingRight: 40,
      paddingBottom: 50,
      fontSize: 29,
    }),
  ],
  btnBox: adaptive({
    position: "relative",
    height: 90,
  }),
  btnBoxWithCancel: {
    "&:after,&::after": {
      content: "''",
      position: "absolute",
      top: 0,
      bottom: 0,
      left: "50%",
      marginLeft: "-.5px",
      width: "1px",
      backgroundColor: "#c0c0c0",
      transform: `scale(${1 / devicePixelRatio}, 1)`,
    },
  },
  btn: [
    {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      userSelect: "none",
      letterSpacing: "1px",
    },
    adaptive({
      fontSize: 33,
    }),
  ],
};
