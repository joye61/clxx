import { useEffect, useRef, Dispatch, SetStateAction } from "react";
import { InertiaData, ScrollViewState } from "./types";
import raf from "raf";
import { correctOffset } from "./correctOffset";

export function useInertia(
  inertiaData: InertiaData,
  state: ScrollViewState,
  setState: Dispatch<SetStateAction<ScrollViewState>>
) {
  /**
   * 声明ref，从动画Effect的依赖中排除
   */
  const stateRef = useRef<ScrollViewState>(state);
  const inertiaRef = useRef<InertiaData>(inertiaData);
  useEffect(() => {
    console.log("更新逻辑这里", stateRef.current.runInertia);
    stateRef.current = state;
    inertiaRef.current = inertiaData;
  });

  // 动画逻辑因为包含不断执行的定时器，所以只能执行一次
  useEffect(() => {
    if (state.runInertia) {
      // 读取当前可执行的最新的惯性数据
      let { speedX, speedY, decayFactor, direction, size } = inertiaRef.current;
      // 速度为0时，直接停止
      if (
        (direction === "horizontal" && speedX === 0) ||
        (direction === "vertical" && speedY === 0)
      ) {
        setState({ ...stateRef.current, runInertia: false });
        return;
      }

      // 当前时间
      let framer: number = raf(frame);
      function frame() {
        // 如果获取到了停止动画的通知，则立即停止动画的执行
        if (!stateRef.current.runInertia) {
          raf.cancel(framer);
          return;
        }

        // 没有停止动画，优先将下一帧执行放入队列，再执行逻辑
        framer = raf(frame);

        // 计算当前的最新速度值，最新速度=上一次速度-摩擦力
        speedX *= decayFactor;
        speedY *= decayFactor;

        // 速度降低到0或反方向，停止运行
        const ratio = 1 / window.devicePixelRatio;
        if (
          (direction === "horizontal" && Math.abs(speedX) <= ratio) ||
          (direction === "vertical" && Math.abs(speedY) <= ratio)
        ) {
          raf.cancel(framer);
          setState({ ...stateRef.current, runInertia: false });
          return;
        }

        // 更新滚动容器位移
        const { offsetX, offsetY } = correctOffset(
          stateRef.current.offsetX + speedX,
          stateRef.current.offsetY + speedY,
          size,
          direction,
          stateRef.current,
          setState
        );

        // 最终更新位置
        setState({ ...stateRef.current, offsetX, offsetY });
      }

      // 清理的时候停止执行动画
      return () => {
        raf.cancel(framer);
      };
    }
  }, [state.runInertia]);
}
