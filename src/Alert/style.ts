import { Interpolation, Theme } from "@emotion/react";

export const style: Record<string, Interpolation<Theme>> = {
  container: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#fff",
    boxShadow: "0 0 2px 0 #00000055",
    borderRadius: '.16rem',
    width: 750 * 0.84 / 100 + 'rem',
  },

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
  title: {
    textAlign: "center",
    lineHeight: 1.4,
    color: "#000",
    paddingTop: '.5rem',
    paddingLeft: '.4rem',
    paddingRight: '.4rem',
    paddingBottom: '.5rem',
    fontSize: '.33rem',
  },
  desc: {
    textAlign: "center",
    lineHeight: 1.4,
    color: "#666",
    paddingTop: '.2rem',
    paddingLeft: '.4rem',
    paddingRight: '.4rem',
    paddingBottom: '.5rem',
    fontSize: '.29rem',
  },
  btnBox: {
    position: "relative",
    height: '.9rem',
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
      backgroundColor: "#c0c0c0",
      transform: `scale(${1 / window.devicePixelRatio}, 1)`,
    },
  },
  btn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    letterSpacing: "1px",
    fontSize: '.33rem',
  },
};
