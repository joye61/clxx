/**
 * 解决移动端滚动相关的所有问题，取代浏览器默认滚动
 */
import "./stopScroll";
import React from "react";

export default class ScrollView extends React.Component {
  containerRef = React.createRef();
  contentRef = React.createRef();

  // 是否正处于触摸互斥态
  isTouching = false;
  transformAttr = "transform";
  coordinate = {
    x: 0,
    y: 0
  };
  coordinateOffset = {
    x: 0,
    y: 0
  }

  state = {
    position: 0 // 默认位置
  };

  constructor(props) {
    super(props);
    this.getTransformAttr();
  }

  getTransformAttr() {
    const list = {
      webkit: "Webkit",
      moz: "Moz",
      ms: "ms",
      o: "O"
    };
    if (typeof document.body.style.transform === "string") {
      return;
    }

    for (const prefix in list) {
      if (typeof document.body.style[`${prefix}Transform`] === "string") {
        this.transformAttr = `${list[prefx]}Transform`;
        return;
      }
    }
  }

  static getDerivedStateFromProps(props) {
    return {
      position: props.position || 0
    };
  }

  componentDidMount() {
    this.container = this.containerRef.current;
    this.content = this.contentRef.current;
    this.containerRect = this.container.getBoundingClientRect();
    this.contentRect = this.content.getBoundingClientRect();
  }

  /**
   * 浅比较内容是否改变
   * @param {*} props
   */
  getSnapshotBeforeUpdate(props) {
    if (
      props.children !== this.props.children ||
      props.children.length !== this.props.children.length
    ) {
      return true;
    }
    return false;
  }

  /**
   * 如果内容改变要改变内容的高度
   * @param {*} props
   * @param {*} state
   * @param {*} hasChange
   */
  componentDidUpdate(props, state, hasChange) {
    if (hasChange) {
      this.containerRect = this.container.getBoundingClientRect();
      this.contentRect = this.content.getBoundingClientRect();
    }
  }

  start(e) {
    if (!this.isTouching) {
      this.isTouching = true;
      const target = e.touches[0];
      this.coordinate = {
        x: target.clientX,
        y: target.clientY
      };
    }
  }
  move(e) {
    if(this.isTouching) {
      const target = e.touches[0];
      const currentCoordinate = {
        x: target.clientX,
        y: target.clientY
      }
      this.coordinateOffset = {
        x: currentCoordinate.x - this.coordinate.x,
        y: currentCoordinate.y - this.coordinate.y
      }
      this.coordinate = currentCoordinate;
    }
  }
  
  end(e) {
    if(this.isTouching) {
      this.isTouching = false;
    }
  }

  /**
   * 获取偏移位置
   */
  getTransform() {
    const translate = () => {
      let str = `translate3d(0, ${this.state.position}px, 0)`;
      if (this.props.direction === "horizontal") {
        str = `translate3d(${this.state.position}px, 0, 0)`;
      }
      return str;
    };

    return { [this.transformAttr]: translate() };
  }

  render() {
    let containerClass = "cl-ScrollView";
    if (typeof this.props.className === "string") {
      containerClass += ` ${this.props.className}`;
    }

    const props = {
      ...this.props,
      className: containerClass
    };

    return (
      <div
        ref={this.containerRef}
        {...props}
        onTouchStart={this.start.bind(this)}
        onTouchMove={this.move.bind(this)}
        onTouchEnd={this.end.bind(this)}
        onTouchCancel={this.end.bind(this)}
      >
        <div ref={this.contentRef} style={this.getTransform()}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
