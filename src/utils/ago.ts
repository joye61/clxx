import dayjs from 'dayjs';

export type AgoValue = {
  // 多久以前数字值
  num: number;
  // 多久以前单位
  unit: 'y' | 'm' | 'd' | 'h' | 'i' | 's';
  // 这是一个默认的格式化中文字符串
  format: string;
};

/**
 * 用于格式化显示：多久以前
 * @param date
 */
export function ago(date: dayjs.ConfigType): AgoValue {
  const now = dayjs();
  const input = dayjs(date);

  if (!input.isValid()) {
    return {
      num: 0,
      unit: 's',
      format: '刚刚',
    };
  }

  const isFuture = input.isAfter(now);
  const from = isFuture ? now : input;
  const to = isFuture ? input : now;

  const years = to.diff(from, 'year');
  if (years >= 1) {
    return {
      num: years,
      unit: 'y',
      format: `${years}年${isFuture ? '后' : '前'}`,
    };
  }

  const months = to.diff(from, 'month');
  if (months >= 1) {
    return {
      num: months,
      unit: 'm',
      format: `${months}个月${isFuture ? '后' : '前'}`,
    };
  }

  const days = to.diff(from, 'day');
  if (days >= 1) {
    return {
      num: days,
      unit: 'd',
      format: `${days}天${isFuture ? '后' : '前'}`,
    };
  }

  const hours = to.diff(from, 'hour');
  if (hours >= 1) {
    return {
      num: hours,
      unit: 'h',
      format: `${hours}小时${isFuture ? '后' : '前'}`,
    };
  }

  const minutes = to.diff(from, 'minute');
  if (minutes >= 1) {
    return {
      num: minutes,
      unit: 'i',
      format: `${minutes}分钟${isFuture ? '后' : '前'}`,
    };
  }

  const seconds = to.diff(from, 'second');
  if (seconds < 10) {
    return {
      num: seconds,
      unit: 's',
      format: isFuture ? '马上' : '刚刚',
    };
  }

  return {
    num: seconds,
    unit: 's',
    format: `${seconds}秒${isFuture ? '后' : '前'}`,
  };
}
