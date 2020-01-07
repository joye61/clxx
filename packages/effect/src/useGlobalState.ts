import { useForceUpdate } from "./useForceUpdate";
import { useEffectOnce } from "./useEffectOnce";
import { useRef } from "react";
import { useUnmount } from "./useUnmount";

export type SetStateAction<V> = (state?: V) => void;

export type updateFunction = () => void;

export type GlobalStateItem<V> = {
  state: V;
  update: Map<number, updateFunction>;
};

export type GlobalStateStore<K, V> = Map<K, GlobalStateItem<V>>;

export type GlobalStateResult<V> = [V, SetStateAction<V>];

/**
 * 更新器的全局自增索引，主要是为了提高删除性能，无需遍历
 */
let globalUpdateIndex = 0;

/**
 * 全局状态存储
 */
let globalStateStore: Map<any, GlobalStateItem<any>> = new Map();

/**
 * 设置全局状态
 * 1、如果状态不存在，则新增
 * 2、如果状态存在，则更新状态，且调用组件的更新器
 *
 * @param key
 * @param value
 */
export function setGlobalState<K = any, V = any>(key: K, value: V) {
  if (globalStateStore.has(key)) {
    // 更新当前状态值
    const item = globalStateStore.get(key) as GlobalStateItem<V>;

    /**
     * 只有当新的状态和旧状态值不同时，才会触发更新
     */
    if (item.state !== value) {
      item.state = value;
      globalStateStore.set(key, item);

      // 如果该状态存在更新器，全部更新
      item.update.forEach(forceUpdate => {
        forceUpdate();
      });
    }
  } else {
    // 值不存在，创建一个新的状态值
    globalStateStore.set(key, {
      state: value,
      update: new Map()
    });
  }
}

/**
 * 获取全局状态
 * @param key
 */
export function getGlobalState<K = any, V = any>(key: K): V | undefined {
  if (globalStateStore.has(key)) {
    return globalStateStore.get(key)!.state;
  }
  return undefined;
}

/**
 * 设置状态的某一个组件更新器
 * @param key
 * @param updater
 * @param updateIndex
 */
function addUpdater<K = any>(
  key: K,
  updater: updateFunction,
  updateIndex: number
) {
  if (globalStateStore.has(key)) {
    const item = globalStateStore.get(key);
    item!.update.set(updateIndex, updater);
  }
}

/**
 * 删除状态的某一个组件更新器
 * @param key
 * @param updateIndex
 */
function removeUpdater<K = any>(key: K, updateIndex: number) {
  if (globalStateStore.has(key)) {
    const item = globalStateStore.get(key);
    item!.update.delete(updateIndex);
  }
}

/**
 * 自定义的组件内使用的Hooks，必须要调用
 * @param key string
 */
export function useGlobalState<K = any, V = any>(
  key: K
): GlobalStateResult<V | undefined> {
  const forceUpdate = useForceUpdate();

  /**
   * 防止key变化，只有在第一次调用时的key有效
   */
  const keyRef = useRef<K>(key);
  /**
   * updater的索引值在组件的生命周期中必须保持稳定
   */
  const updateIndexRef = useRef<number>(globalUpdateIndex);
  /**
   * 同理更新器的值在组件的生命周期中必须保持稳定
   * 返回类似setState的返回值签名
   */
  const setStateRef = useRef<SetStateAction<V | undefined>>((newState?: V) => {
    setGlobalState(keyRef.current, newState);
  });

  /**
   * 返回最新的值
   */
  const state: V | undefined = getGlobalState<K, V>(keyRef.current);

  // 当前副作用逻辑只会执行一次
  useEffectOnce(() => {
    // 更新自增索引
    globalUpdateIndex += 1;
    updateIndexRef.current = globalUpdateIndex;

    // 添加当前引用的更新器
    addUpdater(keyRef.current, forceUpdate, updateIndexRef.current);
  });

  // 组件卸载时要清理对应更新器
  useUnmount(() => {
    removeUpdater(keyRef.current, updateIndexRef.current);
  });

  return [state, setStateRef.current];
}
