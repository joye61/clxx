import React from "react";
import ReactDOM from "react-dom";
import { ToastComponent } from "./ToastComponent";

export default class Toast {
  container = document.createElement("div");
  constructor(option) {
    let config = {
      duration: 3000, // 毫秒
      position: "middle" // 位置 top|middle|center
    };

    if (typeof option === "string") {
      config.content = option;
    }

    if (typeof option === "object") {
      config = { ...config, ...option };
    }

    let className = "cl-Toast-container";
    if (config.position === "top") {
      className += " cl-Toast-container-top";
    } else if (config.position === "bottom") {
      className += " cl-Toast-container-bottom";
    } else {
      className += " cl-Toast-container-middle";
    }

    document.body.appendChild(this.container);
    ReactDOM.render(
      <div className={className}>
        <ToastComponent
          content={config.content}
          duration={config.duration}
          onEnd={() => {
            // 这里是完全结束，需要清理
            ReactDOM.unmountComponentAtNode(this.container);
            this.container.remove();
          }}
        />
      </div>,
      this.container
    );
  }
}
