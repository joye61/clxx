import { useEffect, useRef } from "react";

export function useInterval(callback: Function, delay?: number | null) {
  const savedCallback = useRef<Function>(() => {});
  savedCallback.current = callback;

  useEffect(() => {
    if (delay !== null) {
      const interval = setInterval(() => savedCallback.current(), delay || 0);
      return () => clearInterval(interval);
    }
  }, [delay]);
}
