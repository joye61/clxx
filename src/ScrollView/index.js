/**
 * 解决移动端滚动相关的所有问题，取代浏览器默认滚动
 */
import React from "react";
import Scroll from "./Scroll";

export default class ScrollView extends React.Component {
  // 容器元素
  containerRef = React.createRef();
  // 滚动实例
  scrollInstance = null;

  componentDidMount() {
    this.scrollInstance = new Scroll(this.containerRef.current);
  }

  componentWillUnmount() {
    this.scrollInstance.destroy();
  }

  render() {
    return (
      <div ref={this.containerRef} className="cl-ScrollView">
        <div className="cl-ScrollView-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}
