import dayjs, { Dayjs, ConfigType } from "dayjs";

/**
 * 创建一个月历视图的原始数据表
 * @param usefulFormat dayjs构造函数可以识别的任意值
 * @param startFromSunday 是否以星期天作为一周的第一天
 * @param sizeGuarantee 是否保证生成表格始终有6行
 */
export function calendarTable(
  usefulFormat: ConfigType = dayjs(),
  startFromSunday = false,
  sizeGuarantee = true
) {
  const value = dayjs(usefulFormat);
  const startOfMonth = value.startOf("month");
  const endOfMonth = value.endOf("month");
  const monthStartDay = startOfMonth.date();
  const monthEndDay = endOfMonth.date();

  /**
   * 向列表中添加元素
   * @param element
   */
  const result: Array<Dayjs[]> = [];
  const addDayToResult = (day: Dayjs) => {
    const len = result.length;
    if (len === 0 || result[len - 1].length >= 7) {
      result.push([day]);
    } else {
      result[len - 1].push(day);
    }
  };

  if (startFromSunday) {
    const monthStartWeekDay = startOfMonth.day();
    const monthEndWeekDay = endOfMonth.day();
    // 1、补足上一个月天数
    for (let i = 0; i < monthStartWeekDay; i++) {
      addDayToResult(startOfMonth.subtract(monthStartWeekDay - i, "day"));
    }
    // 2、补足当月的天数
    for (let i = monthStartDay; i <= monthEndDay; i++) {
      addDayToResult(value.date(i));
    }
    // 3、补足下一个月天速
    for (let i = monthEndWeekDay + 1; i <= 6; i++) {
      addDayToResult(endOfMonth.add(i - monthEndWeekDay, "day"));
    }
  } else {
    const monthStartWeekDay = startOfMonth.day() || 7;
    const monthEndWeekDay = endOfMonth.day() || 7;

    // 1、补足上一个月天数
    for (let i = 1; i < monthStartWeekDay; i++) {
      addDayToResult(startOfMonth.subtract(monthStartWeekDay - i, "day"));
    }

    // 2、补足当月的天数
    for (let i = monthStartDay; i <= monthEndDay; i++) {
      addDayToResult(value.date(i));
    }

    // 3、补足下一个月天速
    for (let i = monthEndWeekDay + 1; i <= 7; i++) {
      addDayToResult(endOfMonth.add(i - monthEndWeekDay, "day"));
    }
  }

  // 4、如果保证了表格的尺寸，且结果只有5行
  if (result.length < 6 && sizeGuarantee) {
    const remain = (6 - result.length) * 7;
    const lastDayOfTable = result[result.length - 1][6];
    for (let i = 1; i <= remain; i++) {
      addDayToResult(lastDayOfTable.add(i, "day"));
    }
  }

  return result;
}
