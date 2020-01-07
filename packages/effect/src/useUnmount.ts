import { useRef, useEffect } from "react";

export type ClearFunction = () => void;

/**
 * 执行组件卸载时的清理工作
 * @param clear 清理函数
 */
export function useUnmount(clear: ClearFunction) {
  const clearRef = useRef<ClearFunction>(clear);
  clearRef.current = clear;
  useEffect(() => () => clearRef.current(), []);
}
