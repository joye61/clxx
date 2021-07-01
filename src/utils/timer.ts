type Condition = () => boolean;
type TickCallback = (duration?: number) => void;

type TickOption = {
  // tick的持续时间（毫秒）
  duration?: number;
  // 回调触发的间隔（毫秒）
  interval?: number;
  // 是否在结束时触发回调
  triggerOnEnd?: boolean;
  // 结束回调
  onEnd?: TickCallback;
};

/**
 * 每一帧都会执行的滴答器
 *
 * @param callback TickCallback
 * @param option TickOption
 * @returns
 */
export function tick(callback?: TickCallback, option?: TickOption) {
  // 是否正在运行
  let isTicking = true;
  // requestAnimationFrame的返回值
  let raf = 0;
  // 开始时间
  let start = Date.now();
  // 上次tick的时间
  let lastTick = start;
  // 是否结束时触发回调
  const triggerOnEnd = option?.triggerOnEnd ?? true;

  const frame = () => {
    const now = Date.now();
    const duration = now - start;

    // 1、检测是否结束
    if (!isTicking) {
      triggerOnEnd && callback?.(duration);
      option?.onEnd?.(duration);
      return;
    }

    // 2、检测是否超过设置的最大的持续时间
    if (
      typeof option?.duration === "number" &&
      option.duration > 0 &&
      now - start >= option.duration
    ) {
      triggerOnEnd && callback?.(duration);
      option?.onEnd?.(duration);
      return;
    }

    // 3、到了这一步，确认没有停止，先预约下一帧
    raf = window.requestAnimationFrame(frame);

    // 执行逻辑放在调度后面
    if (typeof option?.interval === "number" && option.interval > 0) {
      // 如果设置了tick的间隔，则没到间隔时间不执行回调
      if (now - lastTick >= option.interval) {
        lastTick += option.interval;
        callback?.(duration);
      }
    } else {
      // 这里是每一帧都要执行的逻辑
      lastTick = now;
      callback?.(duration);
    }
  };

  // 开始执行动画
  frame();

  // 返回停止动画的逻辑
  return () => {
    isTicking = false;
    window.cancelAnimationFrame(raf);
  };
}

/**
 * 等待某种情况发生，否则一直阻塞
 *
 * @param condition 需要不断检测的回调
 * @param maxTime 最大等待时间
 */
export async function waitUntil(
  condition: Condition,
  maxTime?: number
): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    tick(
      () => {
        if (condition()) {
          resolve(true);
        }
      },
      {
        duration: maxTime,
        onEnd() {
          resolve(false);
        },
      }
    );
  });
}

/**
 * 等待固定时间
 * @param duration
 * @returns
 */
export async function sleep(duration: number) {
  return new Promise<void>((resolve) => {
    tick(undefined, {
      duration,
      onEnd() {
        resolve();
      },
    });
  });
}
