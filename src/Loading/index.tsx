import React from "react";
import ReactDOM from "react-dom";
import { WaveLoading } from "./WaveLoading";
import { HelixLoading } from "./HelixLoading";
import { style } from "./style";

export interface LoadingOption<H> {
  type: "wave" | "helix";
  color?: string;
  hint?: H;
}

export class Loading<H> {
  container = document.createElement("div");

  constructor(option: LoadingOption<H>) {
    // 默认配置
    let config: LoadingOption<H> = {
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

    // 支持组件hint
    let hintComponent = null;
    if (React.isValidElement(config.hint)) {
      hintComponent = config.hint;
    } else {
      hintComponent = config.hint ? (
        <p css={style.hint("#fff")}>{config.hint}</p>
      ) : null;
    }

    document.body.appendChild(this.container);
    ReactDOM.render(
      <div css={style.mask}>
        <div css={style.container}>
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
