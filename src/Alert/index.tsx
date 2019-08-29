import React from "react";
import ReactDOM from "react-dom";
import {is} from "../is";
import { AlertComponent, AlertComponentProps } from "./AlertComponent";

/**
 * 弹框提示
 * @param option
 */
export function Alert<T>(option: T | AlertComponentProps<T>) {
  let props: AlertComponentProps<T>;
  if (is.plainObject(option)) {
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
