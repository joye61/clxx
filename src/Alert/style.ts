import { keyframes, ObjectInterpolation } from "@emotion/core";
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

const maskShow = keyframes`
  from {opacity: 0}
  to {opacity: 1}
`;
const maskHide = keyframes`
  from {opacity: 1}
  to {opacity: 0}
`;

type CLStyle = {
  [key: string]: ObjectInterpolation<any>;
};

export const style: CLStyle = {
  maskShow: {
    animation: `${maskShow} 100ms`
  },
  maskHide: {
    animation: `${maskHide} 100ms`
  },
  container: {
    backgroundColor: "#fff",
    overflow: "hidden",
    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)",
    width: "80%",
    borderRadius: vw(10),
    "@media (min-width: 576px)": {
      width: `${576*0.8}px`,
      borderRadius: vw(10, true)
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
    "@media (min-width: 576px)": {
      fontSize: vw(16, true),
      padding: vw(20, true)
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
    "@media (min-width: 576px)": {
      fontSize: vw(16, true),
      lineHeight: vw(40, true)
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
