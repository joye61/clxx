/** @jsx jsx */
import { jsx, ObjectInterpolation } from "@emotion/core";
import {
  ContainerProps,
  ScrollViewState,
  EventHandlerMap,
  MoveData,
  SizeInfo,
  InertiaData
} from "./types";
import { useRef, useState, useEffect, CSSProperties, TouchEvent } from "react";
import { is } from "../is";
import raf from "raf";
import { useInertia } from "./useInertia";

export function Container(props: ContainerProps) {
  let {
    children,
    width,
    height,
    offsetX = 0,
    offsetY = 0,
    direction = "vertical",
    /**
     * 默认设置的是每毫秒的减速度值
     */
    friction = 0.015,
    ...attributes
  } = props;

  // 状态信息
  const [state, setState] = useState<ScrollViewState>({
    offsetX,
    offsetY
  });
  const [runInertia, setRunInertia] = useState<boolean>(false);

  // 尺寸信息
  const size = useRef<SizeInfo>({
    containerWidth: 0,
    containerHeight: 0,
    contentWidth: 0,
    contentHeight: 0
  });
  // 容器引用
  const container = useRef<HTMLDivElement>(null);
  // 内容引用
  const content = useRef<HTMLDivElement>(null);

  // 滚动时的各种临时数据
  const moveData = useRef<MoveData>({
    isMove: false,
    lastX: 0,
    lastY: 0,
    currentX: 0,
    currentY: 0,
    lastMoveTime: 0
  });

  /**
   * 在每一次渲染之后都更新尺寸信息可能会有性能问题
   * 但每次更新都求值可以保证内容高度变化时的计算正确
   */
  useEffect(() => {
    const containerRect = container.current!.getBoundingClientRect();
    const contentRect = content.current!.getBoundingClientRect();
    size.current = {
      containerWidth: containerRect.width,
      containerHeight: containerRect.height,
      contentWidth: contentRect.width,
      contentHeight: contentRect.height
    };
  });

  const correctOffset = (offsetX: number, offsetY: number) => {
    if (offsetX > 0) offsetX = 0;
    if (offsetY > 0) offsetY = 0;
    const minX = size.current.containerWidth - size.current.contentWidth;
    const minY = size.current.containerHeight - size.current.contentHeight;
    if (offsetX < minX) offsetX = minX;
    if (offsetY < minY) offsetY = minY;

    return { offsetX, offsetY };
  };

  useInertia(() => {
    if (runInertia) {
      /**
       * 计算惯性开始时的初始速度
       */
      let speedX = moveData.current.currentX - moveData.current.lastX;
      let speedY = moveData.current.currentY - moveData.current.lastY;
      
      // 惯性时速度不能为0
      if (
        (direction === "horizontal" && speedX === 0) ||
        (direction === "vertical" && speedY === 0)
      ) {
        setRunInertia(false);
        return;
      }

      friction = Math.abs(friction);
      const ax = speedX > 0 ? friction : -friction;
      const ay = speedY > 0 ? friction : -friction;

      let last = Date.now();
      let framer: number = 0;
      const frame = () => {
        console.log(runInertia);
        if (!runInertia) {
          raf.cancel(framer);
          return;
        }

        // 优先将下一次更新排上刷新队列
        framer = raf(frame);

        const now = Date.now();
        const duration = now - last;
        last = now;

        // 计算最新速度
        let newSpeedX = speedX + ax * duration;
        let newSpeedY = speedY + ay * duration;

        // 如果最新的速度变成反向了，需要终止动画
        if (speedX * newSpeedX <= 0) newSpeedX = 0;
        if (speedY * newSpeedY <= 0) newSpeedY = 0;

        // 速度降低到0或反方向，停止运行
        if (
          (direction === "horizontal" && newSpeedX === 0) ||
          (direction === "vertical" && newSpeedY === 0)
        ) {
          raf.cancel(framer);
          setRunInertia(false);
          return;
        }

        // 更新上一次速度
        speedX = newSpeedX;
        speedY = newSpeedY;

        // 更新滚动容器位移
        const { offsetX, offsetY } = correctOffset(
          state.offsetX + speedX,
          state.offsetY + speedY
        );
        setState({ offsetX, offsetY });
      };

      framer = raf(frame);
    }
  }, runInertia);

  const eventHandlerMap: EventHandlerMap = {};
  if (is.touchable()) {
    eventHandlerMap.onTouchStart = (event: TouchEvent) => {
      if (!moveData.current.isMove) {
        // 只要进入触摸状态，立即停止惯性状态
        setRunInertia(false);

        // 初始化触摸状态数据
        moveData.current = {
          isMove: true,
          lastX: event.touches.item(0).clientX,
          lastY: event.touches.item(0).clientY,
          currentX: event.touches.item(0).clientX,
          currentY: event.touches.item(0).clientY,
          lastMoveTime: Date.now()
        };
      }
    };
    eventHandlerMap.onTouchMove = (event: TouchEvent) => {
      if (moveData.current.isMove) {
        // 当前移动事件

        const currentX = event.touches.item(0).clientX;
        const currentY = event.touches.item(0).clientY;
        const offsetX = state.offsetX + currentX - moveData.current.lastX;
        const offsetY = state.offsetY + currentY - moveData.current.lastY;
        // 更新位置
        setState(correctOffset(offsetX, offsetY));
        // 更新滚动临时数据
        moveData.current = {
          ...moveData.current,
          lastX: moveData.current.currentX,
          lastY: moveData.current.currentY,
          currentX,
          currentY,
          lastMoveTime: Date.now()
        };
      }
    };
    const onEnd = () => {
      if (moveData.current.isMove) {
        moveData.current = {
          ...moveData.current,
          isMove: false
        };
        if (Date.now() - moveData.current.lastMoveTime < 300) {
          console.log(1, moveData);
          setRunInertia(true);
        }
      }
    };
    eventHandlerMap.onTouchEnd = onEnd;
    eventHandlerMap.onTouchCancel = onEnd;
  } else {
    eventHandlerMap.onWheel = event => {};
    eventHandlerMap.onMouseDown = event => {};
    eventHandlerMap.onMouseMove = event => {};
    eventHandlerMap.onMouseUp = event => {};
  }

  /**
   * 容器的样式
   */
  const containerStyle: ObjectInterpolation<any> = {
    position: "relative",
    overflow: "hidden",
    width,
    height
  };

  /**
   * 内容的样式
   */
  const subStyle: ObjectInterpolation<any> = {
    position: "absolute",
    left: 0,
    top: 0
  };
  if (direction === "vertical") {
    subStyle.width = "100%";
  } else if (direction === "horizontal") {
    subStyle.height = "100%";
  }

  /**
   * 同一时刻只能一个方向滚动
   */
  const x = direction === "horizontal" ? state.offsetX : 0;
  const y = direction === "horizontal" ? 0 : state.offsetY;

  const transform: CSSProperties = {
    transform: `translate3d(${x}px, ${y}px, 0)`,
    WebkitTransform: `translate3d(${x}px, ${y}px, 0)`
  };

  return (
    <div
      css={containerStyle}
      ref={container}
      {...attributes}
      {...eventHandlerMap}
    >
      <div css={subStyle} ref={content} style={transform}>
        {children}
      </div>
    </div>
  );
}
