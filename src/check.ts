/**
 * 检测某一个条件是否成立，为True值时执行回调
 * 适用于检测某些异步或者延迟结果
 */

export interface CheckParam {
  /**
   * 被检测的条件，返回值为js检测为true的都可以
   */
  condition: () => boolean;
  /**
   * 检测时间间隔，默认50毫秒一次
   */
  interval?: number;
  /**
   * 最大检测次数，默认一直检测
   */
  maxTimes?: number;
  /**
   * 检测结果回掉，一旦执行检测结果，会立即停止检测
   * 1、超过次数限制会返回结果
   * 2、检测成功会返回结果
   */
  onResult?: (ok: boolean) => void;
}

export function check(option: CheckParam) {
  const {
    condition = () => true,
    interval = 50,
    maxTimes = Number.MAX_SAFE_INTEGER,
    onResult = () => {}
  } = option;

  let times = 0;
  let lastResult = false;
  const inter = window.setInterval(() => {
    // 达到最大次数限制
    if (times >= maxTimes) {
      onResult(lastResult);
      window.clearInterval(inter);
      return;
    }

    // 检测成功
    lastResult = condition();
    if (lastResult) {
      onResult(true);
      window.clearInterval(inter);
      return;
    }

    // 检测失败，次数+1，继续检测
    times++;
  }, interval);
}
