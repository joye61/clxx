import { useCallback, useState } from "react";

export const useForceUpdate = () => {
  const [, setState] = useState(0);
  return useCallback(() => setState((num: number) => ++num % 1000000), []);
};
