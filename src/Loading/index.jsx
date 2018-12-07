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

export function WaveLoading() {
  const list = [];
  for (let i = 0; i < 6; i++) {
    list.push(<span className="cl-Loading-wave-item" key={i} />);
  }
  return <div className="cl-Loading-wave-container">{list}</div>;
}

export function HelixLoading() {
  const list = [];
  for (let i = 0; i < 12; i++) {
    list.push(<div className="cl-Loading-helix-item" key={i} />);
  }

  return <div className="cl-Loading-helix-container">{list}</div>;
}

export default class Loading {
  container = document.createElement("div");

  constructor(option) {
    // 默认配置
    let config = {
      type: "helix"
    }
    if(typeof option === "string") {
      config.hint = option;
    } 
    if(typeof option === "object") {
      config = {...config, ...option};
    }

    // 默认Loading样式是转菊花
    let Component = HelixLoading;
    if (config.type.toLowerCase() === "wave") {
      Component = WaveLoading;
    }

    let hintComponent = null;
    if (typeof config.hint === "string") {
      hintComponent = <p className="cl-Loading-hint">{config.hint}</p>;
    }

    if (React.isValidElement(config.hint)) {
      hintComponent = config.hint;
    }

    document.body.appendChild(this.container);
    ReactDOM.render(
      <LoadingMask hintComponent={hintComponent}>
        <Component />
      </LoadingMask>,
      this.container
    );
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this.container);
    this.container.remove();
  }
}
