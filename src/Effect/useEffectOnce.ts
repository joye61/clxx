import { useEffect, useRef } from "react";

export function useEffectOnce(effect: React.EffectCallback) {
  const effectRef = useRef<() => void>(effect);

  useEffect(() => {
    effectRef.current = effect;
  });

  useEffect(() => {
    effectRef.current();
  }, []);
}
