import React from "react";
import ReactDOM from "react-dom";
import { ToastComponent, ToastComponentProps } from "./ToastComponent";
import isPlainObject from "lodash/isPlainObject";

export interface ToastType {
  container: null | HTMLElement;
  create<T>(option: T | ToastComponentProps<T>): void;
}

export const Toast: ToastType = {
  container: null,
  create<T>(option: T | ToastComponentProps<T>) {
    if (this.container === null) {
      this.container = document.createElement("div");
      document.body.appendChild(this.container);
    } else {
      ReactDOM.unmountComponentAtNode(this.container);
    }

    let props: ToastComponentProps<T>;
    if (isPlainObject(option)) {
      props = option as ToastComponentProps<T>;
    } else {
      props = {
        content: option as T
      };
    }

    props.onEnd = () => {
      if (this.container instanceof HTMLElement) {
        ReactDOM.unmountComponentAtNode(this.container);
        this.container.remove();
      }
    };

    ReactDOM.render(<ToastComponent {...props} />, this.container);
  }
};
