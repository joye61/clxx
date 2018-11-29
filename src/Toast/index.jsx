import React from "react";
import ReactDOM from "react-dom";

export class ToastComponent extends React.Component{
  container = React.createRef();
  static defaultProps = {
    duration: 3000,
    onEnd: undefined
  };

  state = {
    show: false
  };

  componentDidMount() {
    const el = this.container.current;
    el.classList.add("cl-Toast-show");
    window.setTimeout(() => {
      el.classList.remove("cl-Toast-show");
      el.classList.add("cl-Toast-hide");
    }, this.props.duration);
  }

  onTransitionEnd() {
    const el = this.container.current;
    if (
      el.classList.contains("cl-Toast-hide") &&
      typeof this.props.onEnd === "function"
    ) {
      this.props.onEnd();
    }
  }

  render() {
    return (
      <div
        className="cl-Toast"
        onTransitionEnd={this.onTransitionEnd.bind(this)}
        ref={this.container}
      >
        {this.props.content}
      </div>
    );
  }
}

export default class Toast {
  container = document.createElement("div");
  constructor(content, duration = 3000) {
    document.body.appendChild(this.container);
    ReactDOM.render(
      <ToastComponent
        content={content}
        duration={duration}
        onEnd={()=>{
          // 这里是完全结束，需要清理
          ReactDOM.unmountComponentAtNode(this.container);
          this.container.remove();
        }}
      />,
      this.container
    );
  }
}
