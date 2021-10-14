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
      width: 750 * 0.8,
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
      // fontWeight: "bold",
    },
    adaptive({
      padding: 30,
      fontSize: 32,
    }),
  ],
  desc: [
    {
      textAlign: "center",
      lineHeight: 1.4,
      color: "#666",
    },
    adaptive({
      padding: 30,
      fontSize: 28,
      marginTop: -45,
    }),
  ],
  btnBox: [
    {
      position: "relative",
      ">div": [
        {
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
          letterSpacing: "1px"
        },
        adaptive({
          fontSize: 32,
        }),
      ],
    },
    adaptive({
      height: 84,
    }),
  ],
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
};
