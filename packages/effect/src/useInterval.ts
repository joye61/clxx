import { useRef, useEffect } from "react";

export type UseIntervalTimer = () => void;

/**
 * 定时器相关的effect，相当于安全的setInterval
 * @param timer 定时器回调
 * @param interval 间隔
 */
export function useInterval(timer: UseIntervalTimer, interval = 3000) {
  // Ref是稳定的，可以从依赖列表剔除
  const timerRef = useRef<UseIntervalTimer>(timer);

  // 更新Ref的值
  useEffect(() => {
    timerRef.current = timer;
  });

  // 会影响计时器重新生成的唯一因素是interval
  useEffect(() => {
    const inter = window.setInterval(timerRef.current, interval);
    return () => {
      window.clearInterval(inter);
    };
  }, [interval]);
}
