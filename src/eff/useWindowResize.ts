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
    const callback = () => resizeRef.current();

    window.addEventListener("resize", callback);
    if (window.onorientationchange !== undefined) {
      window.addEventListener("orientationchange", callback);
    }

    return () => {
      window.removeEventListener("resize", callback);
      if (window.onorientationchange !== undefined) {
        window.removeEventListener("orientationchange", callback);
      }
    };
  }, []);
}
