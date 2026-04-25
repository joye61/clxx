import { useEffect, useRef } from "react";

export function useInterval(callback: () => void, delay?: number | null) {
  const savedCallback = useRef<() => void>(callback);
  savedCallback.current = callback;

  useEffect(() => {
    // 仅当 delay 为有限的非负数时才启动定时器；
    // null/undefined/NaN 等都视为暂停
    if (typeof delay !== "number" || !isFinite(delay) || delay < 0) {
      return;
    }
    const interval = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(interval);
  }, [delay]);
}
