import { useEffect, useState } from "react";
import { ENV_CHANGE_EVENT } from "../utils/global";

/**
 * 一个处理每次环境变更的Hook，每次环境变更都会触发组件刷新
 */
export function useEnvChange() {
  const [, setState] = useState(true);

  useEffect(() => {
    // 处理环境变更通知
    const handleEnvChange = () => {
      setState((prev) => !prev);
    };
    window.addEventListener(ENV_CHANGE_EVENT, handleEnvChange);
    return () => {
      window.removeEventListener(ENV_CHANGE_EVENT, handleEnvChange);
    };
  }, []);
}
