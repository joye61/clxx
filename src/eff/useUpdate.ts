import { useReducer } from "react";

const updateReducer = (num: number): number => (num + 1) % 1_000_000;

/**
 * 返回一个函数，调用该函数，组件会刷新一次
 * @returns
 */
export default function useUpdate(): () => void {
  const [, update] = useReducer(updateReducer, 0);

  return update;
}
