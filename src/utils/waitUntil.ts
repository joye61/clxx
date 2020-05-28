export interface WaitUntilOption {
  /**
   * 检测时间间隔，默认50毫秒一次
   */
  checkInterval?: number;
  /**
   * 最大检测次数，默认200次，也就是10秒
   */
  checkMaxTimes?: number;
}


/**
 * 等待条件成立，条件为函数类型，返回boolean
 * @param condition 
 * @param option 
 */
export async function waitUntil(
  condition: () => boolean,
  option?: WaitUntilOption
) {

  /**
   * 默认配置
   */
  let config: WaitUntilOption = {
    checkInterval: 50,
    checkMaxTimes: 200
  };

  /**
   * 如果存在配置参数，则覆盖默认配置
   */
  if (typeof option === "object") {
    config = { ...config, ...option };
  }

  return new Promise(resolve => {
    let checkTimes = 0;
    let lastResult = false;
    const inter = window.setInterval(() => {
      // 达到最大次数限制
      if (checkTimes >= config.checkMaxTimes!) {
        window.clearInterval(inter);
        resolve(lastResult);
        return;
      }

      // 检测成功
      lastResult = condition();
      if (lastResult) {
        window.clearInterval(inter);
        resolve(true);
        return;
      }

      // 检测失败，次数+1，继续检测
      checkTimes++;
    }, config.checkInterval);
  });
}
