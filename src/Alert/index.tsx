import React from "react";
import ReactDOM from "react-dom";
import { AlertComponent, AlertComponentProps } from "./AlertComponent";

/**
 *
 * @param option
 */
export function Alert(option: string | AlertComponentProps) {
  let props;
  if (typeof option === "string") {
    props = {
      content: option
    };
  } else if (typeof option === "object") {
    props = option;
  } else {
    throw new Error("无效的参数");
  }

  const container = document.createElement("div");
  document.body.appendChild(container);

  props.onHide = () => {
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  };

  ReactDOM.render(<AlertComponent {...props} />, container);
}
