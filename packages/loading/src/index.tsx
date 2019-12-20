/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import ReactDOM from "react-dom";
import { WaveLoading } from "./WaveLoading";
import { HelixLoading } from "./HelixLoading";
import { style } from "./style";
import { FixContainer } from "@clxx/layout";

export interface LoadingOption
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  showMask?: boolean;
  type?: "wave" | "helix";
  hint?: React.ReactNode;
}

export class Loading {
  container = document.createElement("div");

  constructor(option: LoadingOption = {}) {
    let {
      type = "helix",
      hint = undefined,
      showMask = false,
      ...defaultProps
    } = option;
    // 默认Loading样式是转菊花
    let Component = null;
    type = type.toLowerCase() as "wave" | "helix";
    if (type === "wave") {
      Component = WaveLoading;
    } else if (type === "helix") {
      Component = HelixLoading;
    } else {
      throw new Error(`Invalid loading type '${type}'`);
    }

    // 支持组件hint
    let hintComponent = null;
    if (React.isValidElement(hint)) {
      hintComponent = hint;
    } else {
      hintComponent = hint ? (
        <p css={style.hint} className="cl-Loading-hint">
          {hint}
        </p>
      ) : null;
    }

    document.body.appendChild(this.container);
    ReactDOM.render(
      <FixContainer {...defaultProps} showMask={showMask}>
        <div css={style.container} className="cl-Loading-container">
          <Component />
          {hintComponent}
        </div>
      </FixContainer>,
      this.container
    );
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this.container);
    this.container.remove();
  }
}
