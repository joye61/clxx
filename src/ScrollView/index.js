/**
 * 解决移动端滚动相关的所有问题，取代浏览器默认滚动
 */
import React from "react";
import Ticker from "../ticker";
import { passiveSupported, reactTransformAttr } from "./env";
import Handler from "./handler";
import Task from "./task";

export default class ScrollView extends React.Component {
  // 外框元素
  containerRef = React.createRef();
  contentRef = React.createRef();

  containerSize = 0;
  contentSize = 0;

  state = {
    position: 0, // 默认位置
    barSize: 0
  };

  constructor(props) {
    super(props);

    // 禁止默认滚动回调
    this.stopDefaultScroll = event => event.preventDefault();

    // 事件处理函数
    this.handler = new Handler();
    this.onTouchStart = this.handler.onStart.bind(this.handler);
    this.onTouchMove = this.handler.onMove.bind(this.handler);
    this.onTouchEnd = this.handler.onStop.bind(this.handler);

    // 帧处理函数
    this.onTouchNormalControl = Task.onTouchNormalControl.bind(this);
    this.onInertiaNormal = Task.onInertiaNormal.bind(this);
    // this.onTouchPullControll = Task.onTouchPullControll.bind(this);
    // this.onPullRelease = Task.onPullRelease.bind(this);
    // this.onPullRefresh = Task.onPullRefresh.bind(this);
  }

  componentDidMount() {
    this.refreshSize();

    // 初始化Ticker
    this.ticker = new Ticker();

    this.ticker.add(this.onTouchNormalControl);
    this.ticker.add(this.onInertiaNormal);

    // 禁用默认滚动
    document.documentElement.addEventListener(
      "touchstart",
      this.stopDefaultScroll,
      passiveSupported ? { passive: false } : false
    );
  }

  componentWillUnmount() {
    document.documentElement.removeEventListener(
      "touchstart",
      this.stopDefaultScroll
    );
    this.ticker.destroy();
  }

  /**
   * 刷新尺寸信息
   */
  refreshSize() {
    this.containerSize = this.containerRef.current.getBoundingClientRect().height;
    this.contentSize = this.contentRef.current.getBoundingClientRect().height;
    this.range = [this.containerSize - this.contentSize, 0];
    if(this.props.showScrollBar) {
      this.setState({barSize: this.containerSize ** 2 / this.contentSize});
    }
  }

  /**
   * 显示滚动条
   */
  showScrollBar() {
    if (this.props.showScrollBar) {
      const offset =
        (Math.abs(this.state.position) * this.state.barSize) / this.containerSize;
      let barStyle = {
        background: "rgba(0,0,0,.5)",
        position: "absolute",
        height: `${this.state.barSize}px`,
        top: 0,
        right: 0,
        width: "4px",
        [reactTransformAttr]: `translate3d(0, ${offset}px, 0)`
      };
      return <div style={barStyle} />;
    }
  }

  render() {
    let containerClass = "cl-ScrollView";
    if (typeof this.props.className === "string") {
      containerClass += ` ${this.props.className}`;
    }
    let containerStyle = {
      position: "relative",
      overflow: "hidden",
      height: "100%"
    };
    if (typeof this.props.style === "object") {
      containerStyle = { ...containerStyle, ...this.props.style };
    }

    let contentStyle = {
      position: "absolute",
      [reactTransformAttr]: `translate3d(0, ${this.state.position}px, 0)`,
      width: "100%"
    };

    return (
      <div
        ref={this.containerRef}
        style={containerStyle}
        className={containerClass}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}
        onTouchCancel={this.onTouchEnd}
      >
        <div ref={this.contentRef} style={contentStyle}>
          {this.props.children}
        </div>
        {this.showScrollBar()}
      </div>
    );
  }
}
