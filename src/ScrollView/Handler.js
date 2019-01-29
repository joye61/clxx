export default class Handler {
  constructor() {
    // 是否正在控制中
    this.isControl = false;

    // 当前控制点坐标
    this.currentCoordinate = 0;

    // 移动时坐标增量
    this.increment = 0;
  }

  onStart(event) {
    if (!this.isControl) {
      event.stopPropagation();
      this.isControl = true;
      const target = event.touches[0];
      this.currentCoordinate = target.clientY;
    }
  }

  onMove(event) {
    if (this.isControl) {
      const target = event.touches[0];
      this.increment = target.clientY - this.currentCoordinate;
      this.currentCoordinate = target.clientY;
    }
  }

  onStop() {
    if (this.isControl) {
      this.isControl = false;
      this.currentCoordinate = 0;
      this.increment = 0;
    }
  }
}
