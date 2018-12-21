export default class Task {
  /**
   * 惯性滚动的速度衰减系数
   */
  static inertiaDecayFactor = 0.95;
  
  /**
   * 下拉刷新最大范围
   */
  static pullRefreshRange = 200;

  /**
   * 下拉刷新阶段的弹力系数
   */
  static bounceFactor = 0.95;

  /**
   * 在正常状态下更新位置信息
   */
  static updatePositionNormal() {
    let position = this.state.position + this.offset;
    if (position > this.range[1]) {
      position = this.range[1];
    } else if (position < this.range[0]) {
      position = this.range[0];
    }
    if(position !== this.state.position) {
      this.setState({ position });
    }
  }

  /**
   * 当前正处于正常触摸拖拽阶段
   */
  static onTouchNormalControl() {
    if (
      this.handler.isControl &&
      this.range[0] <= this.state.position &&
      this.range[1] >= this.state.position
    ) {
      this.offset =
        this.handler.currentCoordinate - this.handler.lastCoordinate;
      this.handler.lastCoordinate = this.handler.currentCoordinate;
      Task.updatePositionNormal.call(this);
    }
  }

  /**
   * 当前处于正常触摸结束，惯性滚动阶段
   */
  static onInertiaNormal() {
    if (
      !this.handler.isControl &&
      this.range[0] < this.state.position &&
      this.range[1] > this.state.position &&
      Math.abs(this.offset) !== 0
    ) {
      this.offset = this.offset * Task.inertiaDecayFactor;
      if (Math.abs(this.offset) <= 0.5) {
        this.offset = 0;
      } else {
        Task.updatePositionNormal.call(this);
      }
    }
  }

  /**
   * 下拉刷新的下拉阶段
   */
  static onTouchPullControll(){

  }

  /**
   * 下拉刷新的回弹阶段
   */
  static onPullRelease(){

  }

  /**
   * 下拉刷新的正在刷新阶段
   */
  static onPullRefresh(){

  }
}
