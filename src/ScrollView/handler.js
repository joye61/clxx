/**
 * 触摸事件处理程序
 */
export default class Handler {
  // 是否正在控制中
  isControl = false;

  // 上一次的控制点坐标
  lastCoordinate = 0;

  // 当前控制点坐标
  currentCoordinate = 0;

  onStart(event) {
    if (!this.isControl) {
      event.stopPropagation();
      this.isControl = true;
      const target = event.touches[0];
      this.lastCoordinate = target.clientY;
      this.currentCoordinate = target.clientY;
    }
  }

  onMove(event) {
    if (this.isControl) {
      const target = event.touches[0];
      this.currentCoordinate = target.clientY;
    }
  }

  onStop() {
    if (this.isControl) {
      this.isControl = false;
      this.lastCoordinate = 0;
      this.currentCoordinate = 0;
    }
  }
}
