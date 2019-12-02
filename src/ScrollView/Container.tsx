/** @jsx jsx */
import { jsx, ObjectInterpolation } from "@emotion/core";
import {
  ContainerProps,
  ScrollViewState,
  EventHandlerMap,
  MoveData,
  SizeInfo,
  ScrollDirection
} from "./types";
import { useRef, useState, useEffect, CSSProperties, TouchEvent } from "react";
import { is } from "../is";
import { useInertia } from "./useInertia";
import { correctOffset } from "./correctOffset";
import { defaultScroll } from "./defaultScroll";

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
    decayFactor = 0.98,
    ...attributes
  } = props;

  // 状态信息
  const [state, setState] = useState<ScrollViewState>({
    offsetX,
    offsetY,
    runInertia: false
  });

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

  useInertia(
    {
      speedX: moveData.current.currentX - moveData.current.lastX,
      speedY: moveData.current.currentY - moveData.current.lastY,
      decayFactor,
      direction: direction as ScrollDirection,
      size: size.current
    },
    state,
    setState
  );

  const eventHandlerMap: EventHandlerMap = {};
  if (is.touchable()) {
    eventHandlerMap.onTouchStart = (event: TouchEvent) => {
      if (!moveData.current.isMove) {

        // 阻止冒泡，使滚动容器可以嵌套
        event.stopPropagation();

        // 只要进入触摸状态，立即停止惯性状态
        setState({ ...state, runInertia: false });

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
        event.preventDefault();
        // event.nativeEvent.preventDefault();
        // 当前移动事件

        const currentX = event.touches.item(0).clientX;
        const currentY = event.touches.item(0).clientY;
        const offsetX = state.offsetX + currentX - moveData.current.lastX;
        const offsetY = state.offsetY + currentY - moveData.current.lastY;
        // 更新位置
        setState({
          ...state,
          ...correctOffset(
            offsetX,
            offsetY,
            size.current,
            direction as ScrollDirection,
            state,
            setState
          )
        });
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
        // 激活浏览器默认滚动

        moveData.current = {
          ...moveData.current,
          isMove: false
        };
        if (Date.now() - moveData.current.lastMoveTime < 300) {
          setState({ ...state, runInertia: true });
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
