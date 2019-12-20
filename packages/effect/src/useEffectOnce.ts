import { useEffect } from "react";

/**
 * 只执行一次的effect，相当于componentDidMount
 * @param effect 
 */
export function useEffectOnce(effect: React.EffectCallback) {
  useEffect(effect, []);
}
