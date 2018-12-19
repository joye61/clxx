/**
 * 
 */
export default class Handler {
  // 是否正在控制中
  isControlling = true;

  // 当前控制点坐标
  coordinate = {
    x: 0, y: 0
  }

  // 当前控制速度
  // 控制速度由两个帧之间的距离确定
  speed = {
    x: 0, y: 0
  }

  onStart(){}
  onMove(){}
  onStop(){}
  onWheel(){}
}