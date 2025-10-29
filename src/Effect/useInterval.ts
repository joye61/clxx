import { useEffect, useRef } from "react";

export function useInterval(callback: () => void, delay?: number | null) {
  const savedCallback = useRef<() => void>(callback);
  savedCallback.current = callback;

  useEffect(() => {
    if (delay !== null) {
      const interval = setInterval(() => savedCallback.current(), delay || 0);
      return () => clearInterval(interval);
    }
  }, [delay]);
}
