import React from "react";
import { reactTransformAttr } from "./env";

export default function ScrollBar(props) {
  let barStyle = {
    position: "absolute",
    background: props.background
  };

  if (props.direction === "vertical") {
    barStyle = {
      ...barStyle,
      ...{
        [reactTransformAttr]: `translate3d(0, ${props.offset}px, 0)`,
        height: `${props.longSide}px`,
        top: 0,
        right: 0,
        width: `${props.shortSide}px`
      }
    };
  }

  if (props.direction === "horizontal") {
    barStyle = {
      ...barStyle,
      ...{
        [reactTransformAttr]: `translate3d(${props.offset}px, 0, 0)`,
        width: `${props.longSide}px`,
        left: 0,
        bottom: 0,
        height: `${props.shortSide}px`
      }
    };
  }

  return <div className="cl-ScrollView-bar" style={barStyle} />;
}

ScrollBar.defaultProps = {
  background: "rgba(0,0,0,.5)",
  direction: "vertical",
  shortSide: 4,
  longSide: 0,
  offset: 0
};
