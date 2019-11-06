import { keyframes, Interpolation } from "@emotion/core";
import { vw } from "../cssUtil";

export const showAnimation = keyframes`
from {
  opacity: 0;
  transform: scale(0.8);
}
to {
  opacity: 1;
  transform: scale(1);
}
`;
export const hideAnimation = keyframes`
from {
  opacity: 1;
  transform: scale(1);
}
to {
  opacity: 0;
  transform: scale(0.8);
}
`;

type CLStyle = {
  [key: string]: Interpolation;
};

export const style: CLStyle = {
  alert: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9
  },
  alertMask: {
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  container: {
    backgroundColor: "#fff",
    width: "80%",
    borderRadius: vw(10),
    overflow: "hidden",
    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)",
    "@media screen and (min-width: 769px)": {
      width: "320px",
      borderRadius: "10px"
    }
  },
  containerShow: {
    animation: `${showAnimation} 100ms ease-in`
  },
  containerHide: {
    animation: `${hideAnimation} 100ms ease-out`
  },
  content: {
    fontSize: vw(16),
    margin: 0,
    padding: vw(20),
    textAlign: "center",
    color: "#333",
    lineHeight: 1.6,
    "@media screen and (min-width: 769px)": {
      fontSize: "16px",
      padding: "30px"
    }
  },
  btn: {
    display: "flex",
    fontSize: 0,
    position: "relative",
    "&::before": {
      position: "absolute",
      top: "-1px",
      left: 0,
      content: `""`,
      display: "block",
      borderTop: "1px solid #e0e0e0",
      width: "100%",
      height: "1px",
      transform: `scaleY(${1 / window.devicePixelRatio})`
    }
  },
  btnItem: {
    cursor: "pointer",
    flex: 1,
    background: "transparent",
    fontSize: vw(16),
    lineHeight: vw(40),
    textAlign: "center",
    boxSizing: "border-box",
    userSelect: "none",
    WebkitTapHighlightColor: "tansparent",
    fontWeight: 500,
    "@media screen and (min-width: 769px)": {
      fontSize: "15px",
      lineHeight: "50px"
    }
  },
  confirm: {
    border: "none",
    color: "#007bff",
    "&:active": {
      color: "#006bde",
      backgroundColor: "#f5f5f5"
    }
  },
  cancel: {
    border: "none",
    color: "#888",
    position: "relative",
    "&::after": {
      position: "absolute",
      content: `""`,
      height: "100%",
      width: "1px",
      right: "-1px",
      borderRight: "1px solid #e0e0e0",
      transform: `scaleX(${1 / window.devicePixelRatio})`
    },
    "&:active": {
      color: " #555",
      backgroundColor: "#f5f5f5"
    }
  }
};
