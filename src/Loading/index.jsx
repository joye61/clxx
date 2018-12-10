import React from "react";
import ReactDOM from "react-dom";

function LoadingMask({ hintComponent, children }) {
  return (
    <div className="cl-Loading-mask">
      <div className="cl-Loading">
        {children}
        {hintComponent}
      </div>
    </div>
  );
}

/**
 * 波浪形Loading
 * @param {*} color 颜色
 */
export function WaveLoading({ color = "#fff" }) {
  const list = [];
  for (let i = 0; i < 6; i++) {
    list.push(
      <span
        className="cl-Loading-wave-item"
        key={i}
        style={{ backgroundColor: color }}
      />
    );
  }
  return <div className="cl-Loading-wave-container">{list}</div>;
}

/**
 * 菊花齿轮形Loading
 * @param {*} color 颜色
 */
export function HelixLoading({ color = "#fff" }) {
  const list = [];
  for (let i = 0; i < 12; i++) {
    list.push(
      <div className="cl-Loading-helix-item" key={i}>
        <span
          className="cl-Loading-helix-itembar"
          style={{ backgroundColor: color }}
        />
      </div>
    );
  }
  return <div className="cl-Loading-helix-container">{list}</div>;
}

/**
 * 三点起伏式Loading
 * @param {*} color 颜色
 */
export function DottedLoading({ color = "#fff" }) {
  const list = [];
  for (let i = 0; i < 3; i++) {
    list.push(
      <span
        className="cl-Loading-dotted-item"
        style={{ backgroundColor: color }}
      />
    );
  }
  return <div className="cl-Loading-dotted-container">{list}</div>;
}

export default class Loading {
  container = document.createElement("div");

  constructor(option) {
    // 默认配置
    let config = {
      type: "wave",
      color: undefined,
      hintColor: "#fff"
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
    } else if (type === "dotted") {
      Component = DottedLoading;
    } else if (type === "helix") {
      Component = HelixLoading;
    } else {
      throw new Error(`Invalid loading type '${config.type}'`);
    }

    let hintComponent = null;
    if (typeof config.hint === "string") {
      hintComponent = (
        <p className="cl-Loading-hint" style={{ color: config.hintColor }}>
          {config.hint}
        </p>
      );
    }

    if (React.isValidElement(config.hint)) {
      hintComponent = config.hint;
    }

    document.body.appendChild(this.container);
    ReactDOM.render(
      <LoadingMask hintComponent={hintComponent}>
        <Component color={config.color || undefined} />
      </LoadingMask>,
      this.container
    );
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this.container);
    this.container.remove();
  }
}
