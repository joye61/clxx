import React from "react";
import ReactDOM from "react-dom";
import { Toast as ToastComponent, ToastProps } from "./Toast";
import { is } from "../is";

export interface ToastType {
  container: null | HTMLElement;
  create(option: React.ReactNode | ToastProps): void;
}

export const Toast: ToastType = {
  container: null,
  create(option) {
    if (this.container === null) {
      this.container = document.createElement("div");
      document.body.appendChild(this.container);
    } else {
      ReactDOM.unmountComponentAtNode(this.container);
    }

    let props: ToastProps;
    if (is.plainObject(option) && (option as ToastProps).content) {
      props = option as ToastProps;
    } else {
      props = {
        content: option
      };
    }

    props.onEnd = () => {
      if (this.container instanceof HTMLElement) {
        ReactDOM.unmountComponentAtNode(this.container);
        this.container.remove();
        this.container = null;
      }
    };

    ReactDOM.render(<ToastComponent {...props} />, this.container);
  }
};
