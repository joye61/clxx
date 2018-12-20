/**
 * 解决移动端滚动相关的所有问题，取代浏览器默认滚动
 */
import "./stopScroll";
import React from "react";
import Ticker from "../ticker";
import { passiveSupported, reactTransformAttr } from "./env";
import ScrollBar from "./ScrollBar";

export default class ScrollView extends React.Component {
  // 外框元素
  containerRef = React.createRef();
  contentRef = React.createRef();
  diffRect = {
    x: 0,
    y: 0
  };

  // 逐帧计时器
  ticker = null;

  // 是否处于触摸状态
  isTouching = false;

  // 是否处于惯性状态
  isInertia = false;

  // 当前坐标
  coordinate = {
    x: 0,
    y: 0
  };
  // 移动坐标
  moveCoordinate = {
    x: 0,
    y: 0
  };
  // 偏移坐标
  offset = {
    x: 0,
    y: 0
  };

  // 衰减系数
  factor = 0.95;
  // 速度值
  speed = 0;

  state = {
    position: 0, // 默认位置
    barSize: 0, // 滚动条高度
    barOffset: 0 // 滚动条距离顶部的距离
  };

  constructor(props) {
    super(props);

    this.axis = this.props.direction === "horizontal" ? "x" : "y";

    // 拖动帧
    this.frameDragTask = this.frameDrag.bind(this);
    // 惯性帧
    this.frameInertiaTask = this.frameInertia.bind(this);

    // 禁止默认滚动
    this.stopDefaultScroll = event => event.preventDefault();
  }

  static getDerivedStateFromProps(props) {
    if (
      typeof props.position === "number" &&
      props.position !== this.state.position
    ) {
      return {
        position: props.position
      };
    }

    return null;
  }

  componentDidMount() {
    this.container = this.containerRef.current;
    this.content = this.contentRef.current;
    this.refreshSize();

    // 初始化Ticker
    this.ticker = new Ticker();
    this.ticker.add(this.refreshSize.bind(this));
    this.ticker.add(this.frameDragTask);
    this.ticker.add(this.frameInertiaTask);

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
   * 刷新滚动尺寸
   */
  refreshSize() {
    this.containerRect = this.container.getBoundingClientRect();
    this.contentRect = this.content.getBoundingClientRect();
    this.diffRect = {
      x: this.containerRect.width - this.contentRect.width,
      y: this.containerRect.height - this.contentRect.height
    };

    // 如果需要滚动条，并且内容溢出，则设置滚动条尺寸
    if (this.props.showScrollBar && this.diffRect[this.axis] < 0) {
      this.refreshBarSize();
    }
  }

  /**
   * 刷新滚动条尺寸信息
   */
  refreshBarSize() {
    let barSize = this.containerRect.height ** 2 / this.contentRect.height;
    let barOffset =
      (Math.abs(this.state.position) * barSize) / this.containerRect.height;
    if (this.axis === "x") {
      barSize = this.containerRect.width ** 2 / this.contentRect.width;
      barOffset =
        (Math.abs(this.state.position) * barSize) / this.containerRect.width;
    }

    this.setState({ barSize, barOffset });
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
    hasChange && this.refreshSize();
  }

  /**
   * 获取实际位置
   * @param {number} position
   */
  getPosition(position) {
    const range = [this.diffRect[this.axis], 0];
    // 滚动不能超过容器临界值
    if (position <= range[0]) {
      position = range[0];
      this.speed = 0;
    } else if (position >= range[1]) {
      position = range[1];
      this.speed = 0;
    }
    return position;
  }

  /**
   * 手指拖动偏移
   */
  frameDrag() {
    if (this.isTouching) {
      // 目标偏移
      this.offset = {
        x: this.moveCoordinate.x - this.coordinate.x,
        y: this.moveCoordinate.y - this.coordinate.y
      };

      this.coordinate = this.moveCoordinate;
      const position = this.getPosition(
        this.state.position + this.offset[this.axis]
      );
      if (this.state.position !== position) {
        this.setState({ position });
        this.refreshBarSize();
      }
    }
  }

  /**
   * 惯性偏移
   */
  frameInertia() {
    if (this.isInertia) {
      // 新速度为当前速度乘以衰减系数
      this.speed *= this.factor;

      // 速度降低到一个极小值，认为速度为0，已经停止下来了
      if (Math.abs(this.speed) <= 0.5) {
        this.isInertia = false;
        this.speed = 0;
      }
      // 惯性滚动
      else {
        const position = this.getPosition(this.state.position + this.speed);
        if (this.state.position !== position) {
          this.setState({ position });
          this.refreshBarSize();
        }
      }
    }
  }

  start(e) {
    // 如果内容高度小于容器高度，阻止滚动
    if (this.diffRect[this.axis] >= 0) {
      return;
    }

    // 立即停止惯性状态
    if (this.isInertia) {
      this.isInertia = false;
      this.speed = 0;
    }

    if (!this.isTouching) {
      // 阻止事件冒泡
      e.stopPropagation();
      this.isTouching = true;
      const target = e.touches[0];
      this.coordinate = this.moveCoordinate = {
        x: target.clientX,
        y: target.clientY
      };
    }
  }

  move(e) {
    if (this.isTouching) {
      const target = e.touches[0];
      this.moveCoordinate = {
        x: target.clientX,
        y: target.clientY
      };
    }
  }

  end(e) {
    if (this.isTouching) {
      this.isTouching = false;

      // 如果存在惯性，手指离开之后要惯性滚动一段距离
      this.speed = this.offset[this.axis];
      if (this.speed !== 0) {
        this.isInertia = true;
      }
    }
  }

  /**
   * 获取偏移位置
   */
  getContentStyle() {
    const translate = () => {
      let str = `translate3d(0, ${this.state.position}px, 0)`;
      if (this.axis === "x") {
        str = `translate3d(${this.state.position}px, 0, 0)`;
      }
      return str;
    };

    let style = {
      position: "absolute",
      [reactTransformAttr]: translate()
    };

    if (this.axis === "x") {
      style.height = "100%";
    } else {
      style.width = "100%";
    }

    return style;
  }

  /**
   * 显示滚动条
   */
  showScrollBar() {
    if (this.props.showScrollBar && this.diffRect[this.axis] < 0) {
      return (
        <ScrollBar
          longSide={this.state.barSize}
          offset={this.state.barOffset}
          direction={this.props.direction}
        />
      );
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

    return (
      <div
        ref={this.containerRef}
        style={containerStyle}
        className={containerClass}
        onTouchStart={this.start.bind(this)}
        onTouchMove={this.move.bind(this)}
        onTouchEnd={this.end.bind(this)}
        onTouchCancel={this.end.bind(this)}
      >
        <div ref={this.contentRef} style={this.getContentStyle()}>
          {this.props.children}
        </div>
        {this.showScrollBar()}
      </div>
    );
  }
}
