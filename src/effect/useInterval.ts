import { useEffect, useRef } from "react";

const useInterval = (callback: Function, delay?: number | null) => {
  const savedCallback = useRef<Function>(() => {});
  savedCallback.current = callback;

  useEffect(() => {
    if (delay !== null) {
      const interval = setInterval(savedCallback.current, delay || 0);
      return () => clearInterval(interval);
    }
  }, [delay]);
};

export default useInterval;
