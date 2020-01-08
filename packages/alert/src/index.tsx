import React from "react";
import ReactDOM from "react-dom";
import { Alert as AlertComponent, AlertProps } from "./Alert";

/**
 * 弹框提示
 * @param option
 */
export function Alert(option: React.ReactNode | Partial<AlertProps>) {
  let props: Partial<AlertProps>;
  if (typeof option === "object" && (option as AlertProps).content) {
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
