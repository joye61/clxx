import { useEffect, useRef } from "react";

/**
 * 窗口尺寸变化时触发（包括屏幕旋转）
 * 注意：移动端 resize 事件通常只在旋转屏幕时触发，频率很低，不需要防抖
 * 
 * @param onResize 窗口尺寸变化时的回调函数
 */
export function useWindowResize(onResize: () => void) {
  const callbackRef = useRef<() => void>(onResize);

  // 每次渲染都更新回调引用，避免闭包陈旧
  callbackRef.current = onResize;

  useEffect(() => {
    const callback = () => callbackRef.current();

    // 监听窗口大小变化
    window.addEventListener("resize", callback);

    // 监听屏幕方向变化（使用现代 API）
    const mediaQuery = window.matchMedia("(orientation: portrait)");

    // 现代浏览器使用 change 事件
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", callback);
    } else {
      // 降级处理：旧浏览器使用 addListener
      // @ts-ignore
      mediaQuery.addListener(callback);
    }

    return () => {
      window.removeEventListener("resize", callback);

      // 清理 orientation 监听器
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", callback);
      } else {
        // 降级处理
        // @ts-ignore
        mediaQuery.removeListener(callback);
      }
    };
  }, []); // 空依赖数组，因为使用了 ref
}
