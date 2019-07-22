import React from "react";
import ReactDOM from "react-dom";
import { WaveLoading } from "./WaveLoading";
import { HelixLoading } from "./HelixLoading";

export interface LoadingOption {
  type: "wave" | "helix";
  color: string;
  hint?: string | React.ReactElement;
}

export class Loading {
  container = document.createElement("div");

  constructor(option: LoadingOption) {
    // 默认配置
    let config: LoadingOption = {
      type: "wave",
      color: "#fff"
    };
    if (typeof option === "string") {
      config.hint = option;
    }
    if (typeof option === "object") {
      config = { ...config, ...option };
    }

    // 默认Loading样式是转菊花
    let Component = null;
    let type = config.type.toLowerCase();
    if (type === "wave") {
      Component = WaveLoading;
    } else if (type === "helix") {
      Component = HelixLoading;
    } else {
      throw new Error(`Invalid loading type '${config.type}'`);
    }

    let hintComponent = null;
    if (typeof config.hint === "string") {
      hintComponent = (
        <p className="cl-Loading-hint" style={{ color: "#fff" }}>
          {config.hint}
        </p>
      );
    }

    if (React.isValidElement(config.hint)) {
      hintComponent = config.hint;
    }

    document.body.appendChild(this.container);
    ReactDOM.render(
      <div className="cl-Loading-mask">
        <div className="cl-Loading">
          <Component color={config.color} />
          {hintComponent}
        </div>
      </div>,
      this.container
    );
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this.container);
    this.container.remove();
  }
}
