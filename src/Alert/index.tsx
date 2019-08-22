import React from "react";
import ReactDOM from "react-dom";
import isPlainObject from "lodash/isPlainObject";
import { AlertComponent, AlertComponentProps } from "./AlertComponent";

/**
 * 弹框提示
 * @param option
 */
export function Alert<T>(option: T | AlertComponentProps<T>) {
  let props: AlertComponentProps<T>;
  if (isPlainObject(option)) {
    props = option as AlertComponentProps<T>;
  } else {
    props = {
      content: option as T
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
