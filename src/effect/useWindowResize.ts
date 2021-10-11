import { useEffect, useRef } from "react";

/**
 * 窗口尺寸变化时触发
 * @param onResize
 */
export function useWindowResize(onResize: () => void) {
  const resizeRef = useRef<() => void>(onResize);
  // 每次捕获最新的回调
  resizeRef.current = onResize;

  useEffect(() => {
    window.addEventListener("resize", resizeRef.current);
    if (window.onorientationchange !== undefined) {
      window.addEventListener("orientationchange", resizeRef.current);
    }

    return () => {
      window.removeEventListener("resize", resizeRef.current);
      if (window.onorientationchange !== undefined) {
        window.removeEventListener("orientationchange", resizeRef.current);
      }
    };
  }, []);
}
