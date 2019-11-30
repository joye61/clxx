import { useEffect, useRef } from "react";

export function useInertia(
  effect: React.EffectCallback,
  runInertia: boolean = false
) {
  const effectRef = useRef<() => void>(effect);

  useEffect(() => {
    effectRef.current = effect;
  });

  useEffect(()=>{
		effectRef.current();
	}, [runInertia]);
}
