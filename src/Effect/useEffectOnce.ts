import { useEffect } from "react";

export function useEffectOnce(effect: React.EffectCallback) {
  useEffect(effect, []);
}
