import React from "react";
import ReactDOM from "react-dom";
import { is } from "../is";
import { Alert as AlertComponent, AlertProps } from "./Alert";

/**
 * 弹框提示
 * @param option
 */
export function Alert(option: React.ReactNode | AlertProps) {
  let props: AlertProps;
  if (is.plainObject(option) && (option as AlertProps).content) {
    props = option as AlertProps;
  } else {
    props = {
      content: option
    };
  }

  const container = document.createElement("div");
  document.body.appendChild(container);

  props.onHide = () => {
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  };

  ReactDOM.render(<AlertComponent {...props} />, container);
}
