import React from "react";
import ReactDOM from "react-dom";

export class ToastComponent extends React.Component {
  static defaultProps = {
    duration: 3000,
    onEnd: undefined
  };

  state = {
    animationClass: "cl-Toast cl-Toast-show"
  }

  componentDidMount() {
    window.setTimeout(() => {
      this.setState({
        animationClass: "cl-Toast cl-Toast-hide"
      });
    }, this.props.duration);
  }

  onAnimationEnd(e){
    if(e.animationName === 'cl-Toast-hide' && typeof this.props.onEnd === "function") {
      this.props.onEnd();
    }
  }

  render() {
    return (
      <div
        className={this.state.animationClass}
        onAnimationEnd={this.onAnimationEnd.bind(this)}
      >
        {this.props.content}
      </div>
    );
  }
}

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
