/** @jsx jsx */
import { jsx, ObjectInterpolation } from "@emotion/core";
import {
  ContainerProps,
  ScrollViewState,
  EventHandlerMap,
  MoveData,
  SizeInfo
} from "./types";
import { useRef, useState, useEffect, CSSProperties, TouchEvent } from "react";
import { is } from "../is";

export function Container(props: ContainerProps) {
  const { children, height, direction = "vertical", ...attributes } = props;

  // 状态信息
  const [state, setState] = useState<ScrollViewState>({
    offsetX: 0,
    offsetY: 0
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
    currentY: 0
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

  const eventHandlerMap: EventHandlerMap = {};
  if (is.touchable()) {
    eventHandlerMap.onTouchStart = (event: TouchEvent) => {
      if (!moveData.current.isMove) {
        moveData.current = {
          isMove: true,
          lastX: event.touches.item(0).clientX,
          lastY: event.touches.item(0).clientY,
          currentX: event.touches.item(0).clientX,
          currentY: event.touches.item(0).clientY
        };
      }
    };
    eventHandlerMap.onTouchMove = (event: TouchEvent) => {
      if (moveData.current.isMove) {
        const currentX = event.touches.item(0).clientX;
        const currentY = event.touches.item(0).clientY;
        // 更新位置
        setState({
          ...state,
          offsetX: state.offsetX + currentX - moveData.current.currentX,
          offsetY: state.offsetY + currentY - moveData.current.currentY
        });
        // 更新滚动临时数据
        moveData.current = { ...moveData.current, currentX, currentY };
      }
    };
    eventHandlerMap.onTouchEnd = event => {};
    eventHandlerMap.onTouchCancel = event => {};
  } else {
    eventHandlerMap.onWheel = event => {};
    eventHandlerMap.onMouseDown = event => {};
    eventHandlerMap.onMouseMove = event => {};
    eventHandlerMap.onMouseUp = event => {};
  }

  const containerStyle: ObjectInterpolation<any> = {
    position: "relative",
    overflow: "hidden",
    height
  };

  const subStyle: ObjectInterpolation<any> = {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%"
  };

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
