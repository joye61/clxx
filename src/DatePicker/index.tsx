import { ReactNode, useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { showDialog } from "../Dialog";
import { Clickable } from "../Clickable";
import { createStyle, DEFAULT_PRIMARY } from "./style";
import { Column } from "./Column";

export type DatePickerPrecision = "day" | "hour" | "minute" | "second";

export type DateInput = Date | string | number | Dayjs;

export interface DatePickerUnits {
  year?: string;
  month?: string;
  day?: string;
  hour?: string;
  minute?: string;
  second?: string;
}

export const DEFAULT_UNITS: Required<DatePickerUnits> = {
  year: "年",
  month: "月",
  day: "日",
  hour: "时",
  minute: "分",
  second: "秒",
};

export interface DatePickerProps {
  // 初始值，默认当前日期时间
  value?: DateInput;
  // 精度：day=年月日；hour=+时；minute=+分；second=+秒
  precision?: DatePickerPrecision;
  // 头部标题
  title?: ReactNode;
  cancelText?: ReactNode;
  confirmText?: ReactNode;
  // 点击遮罩是否可关闭（仅在通过 showDatePicker 弹出时生效）
  maskClosable?: boolean;
  // 主题主色
  primary?: string;
  // 是否圈圆角（同时影响面板顶部与中间选中背景块），默认 true
  rounded?: boolean;
  // 是否在每列数字后显示单位（如 "2024年"），默认 true
  showUnit?: boolean;
  // 各列单位文案，默认中文：年月日时分秒。可部分覆盖
  units?: DatePickerUnits;
  // 可选的可选范围（默认年份 1900-2100）
  minDate?: DateInput;
  maxDate?: DateInput;
  // 弹出动画结束后调用，实际卸载交由外部（showDatePicker）处理
  onClose?: () => void;
  // 用户取消
  onCancel?: () => void;
  // 用户确认，返回 dayjs 对象
  onConfirm?: (date: Dayjs) => void;
}

// ----------------- 主组件 -----------------

function toDayjs(v: DateInput | undefined): Dayjs {
  if (v === undefined) return dayjs();
  // dayjs 可以接收 Date/string/number/Dayjs
  const d = dayjs(v as dayjs.ConfigType);
  return d.isValid() ? d : dayjs();
}

function range(start: number, end: number): number[] {
  const arr: number[] = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
}

const pad2 = (n: number) => (n < 10 ? "0" + n : "" + n);

export function DatePicker(props: DatePickerProps) {
  const {
    value,
    precision = "day",
    title = "请选择",
    cancelText = "取消",
    confirmText = "确定",
    primary = DEFAULT_PRIMARY,
    rounded = true,
    showUnit = true,
    units,
    minDate,
    maxDate,
    onClose,
    onCancel,
    onConfirm,
  } = props;

  const style = useMemo(
    () => createStyle(primary, rounded),
    [primary, rounded],
  );

  // 合并单位配置：用户部分覆盖 + 默认中文
  const u = useMemo(() => ({ ...DEFAULT_UNITS, ...units }), [units]);
  // showUnit=false 时不追加单位后缀
  const suffix = (key: keyof DatePickerUnits) => (showUnit ? u[key] : "");

  const minD = useMemo(
    () => (minDate !== undefined ? toDayjs(minDate) : dayjs("1900-01-01")),
    [minDate],
  );
  const maxD = useMemo(
    () =>
      maxDate !== undefined ? toDayjs(maxDate) : dayjs("2100-12-31 23:59:59"),
    [maxDate],
  );

  // 初始值限制在 [minD, maxD] 范围内
  const initial = useMemo(() => {
    let d = toDayjs(value);
    if (d.isBefore(minD)) d = minD;
    if (d.isAfter(maxD)) d = maxD;
    return d;
  }, [value, minD, maxD]);

  const [year, setYear] = useState(initial.year());
  const [month, setMonth] = useState(initial.month() + 1); // 1-12
  const [day, setDay] = useState(initial.date());
  const [hour, setHour] = useState(initial.hour());
  const [minute, setMinute] = useState(initial.minute());
  const [second, setSecond] = useState(initial.second());

  const showHour = precision !== "day";
  const showMinute = precision === "minute" || precision === "second";
  const showSecond = precision === "second";

  // 各列范围计算（考虑 min/max）
  const years = useMemo(() => range(minD.year(), maxD.year()), [minD, maxD]);

  const months = useMemo(() => {
    let s = 1;
    let e = 12;
    if (year === minD.year()) s = minD.month() + 1;
    if (year === maxD.year()) e = maxD.month() + 1;
    if (s > e) {
      // 不应发生；兜底返回单月
      return [s];
    }
    return range(s, e);
  }, [year, minD, maxD]);

  const days = useMemo(() => {
    const daysInMonth = dayjs(`${year}-${pad2(month)}-01`).daysInMonth();
    let s = 1;
    let e = daysInMonth;
    if (year === minD.year() && month === minD.month() + 1) s = minD.date();
    if (year === maxD.year() && month === maxD.month() + 1) e = maxD.date();
    if (s > e) return [s];
    return range(s, e);
  }, [year, month, minD, maxD]);

  const hours = useMemo(() => {
    let s = 0;
    let e = 23;
    if (
      year === minD.year() &&
      month === minD.month() + 1 &&
      day === minD.date()
    )
      s = minD.hour();
    if (
      year === maxD.year() &&
      month === maxD.month() + 1 &&
      day === maxD.date()
    )
      e = maxD.hour();
    if (s > e) return [s];
    return range(s, e);
  }, [year, month, day, minD, maxD]);

  const minutes = useMemo(() => {
    let s = 0;
    let e = 59;
    if (
      year === minD.year() &&
      month === minD.month() + 1 &&
      day === minD.date() &&
      hour === minD.hour()
    )
      s = minD.minute();
    if (
      year === maxD.year() &&
      month === maxD.month() + 1 &&
      day === maxD.date() &&
      hour === maxD.hour()
    )
      e = maxD.minute();
    if (s > e) return [s];
    return range(s, e);
  }, [year, month, day, hour, minD, maxD]);

  const seconds = useMemo(() => {
    let s = 0;
    let e = 59;
    if (
      year === minD.year() &&
      month === minD.month() + 1 &&
      day === minD.date() &&
      hour === minD.hour() &&
      minute === minD.minute()
    )
      s = minD.second();
    if (
      year === maxD.year() &&
      month === maxD.month() + 1 &&
      day === maxD.date() &&
      hour === maxD.hour() &&
      minute === maxD.minute()
    )
      e = maxD.second();
    if (s > e) return [s];
    return range(s, e);
  }, [year, month, day, hour, minute, minD, maxD]);

  // 联动夹取：超出范围 → 夹到最近边界（小于 min 取首；大于 max 取尾）
  const clampToList = (v: number, list: number[]) => {
    if (list.includes(v)) return v;
    if (v < list[0]) return list[0];
    return list[list.length - 1];
  };

  useEffect(() => {
    const next = clampToList(month, months);
    if (next !== month) setMonth(next);
  }, [months, month]);
  useEffect(() => {
    const next = clampToList(day, days);
    if (next !== day) setDay(next);
  }, [days, day]);
  useEffect(() => {
    if (!showHour) return;
    const next = clampToList(hour, hours);
    if (next !== hour) setHour(next);
  }, [hours, hour, showHour]);
  useEffect(() => {
    if (!showMinute) return;
    const next = clampToList(minute, minutes);
    if (next !== minute) setMinute(next);
  }, [minutes, minute, showMinute]);
  useEffect(() => {
    if (!showSecond) return;
    const next = clampToList(second, seconds);
    if (next !== second) setSecond(next);
  }, [seconds, second, showSecond]);

  // 关闭：动画与卸载交由 Dialog 处理
  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  const handleConfirm = () => {
    const hh = showHour ? hour : 0;
    const mm = showMinute ? minute : 0;
    const ss = showSecond ? second : 0;
    // 用 ISO 字符串构造，避免链式 set 时的月份溢出问题
    const d = dayjs(
      `${year}-${pad2(month)}-${pad2(day)}T${pad2(hh)}:${pad2(mm)}:${pad2(ss)}`,
    );
    onConfirm?.(d);
    onClose?.();
  };

  return (
    <div css={style.sheet}>
      <div css={style.header}>
        <Clickable css={[style.btn, style.btnCancel]} onClick={handleCancel}>
          {cancelText}
        </Clickable>
        <div css={style.title}>{title}</div>
        <Clickable css={[style.btn, style.btnConfirm]} onClick={handleConfirm}>
          {confirmText}
        </Clickable>
      </div>
      <div css={style.body}>
        <div css={style.indicator} />
        <Column
          items={years}
          value={year}
          onChange={setYear}
          format={(n) => `${n}${suffix("year")}`}
          style={style}
        />
        <Column
          items={months}
          value={month}
          onChange={setMonth}
          format={(n) => `${pad2(n)}${suffix("month")}`}
          style={style}
        />
        <Column
          items={days}
          value={day}
          onChange={setDay}
          format={(n) => `${pad2(n)}${suffix("day")}`}
          style={style}
        />
        {showHour && (
          <Column
            items={hours}
            value={hour}
            onChange={setHour}
            format={(n) => `${pad2(n)}${suffix("hour")}`}
            style={style}
          />
        )}
        {showMinute && (
          <Column
            items={minutes}
            value={minute}
            onChange={setMinute}
            format={(n) => `${pad2(n)}${suffix("minute")}`}
            style={style}
          />
        )}
        {showSecond && (
          <Column
            items={seconds}
            value={second}
            onChange={setSecond}
            format={(n) => `${pad2(n)}${suffix("second")}`}
            style={style}
          />
        )}
      </div>
    </div>
  );
}

export function showDatePicker(
  options: Pick<
    DatePickerProps,
    | "value"
    | "precision"
    | "title"
    | "cancelText"
    | "confirmText"
    | "maskClosable"
    | "primary"
    | "rounded"
    | "showUnit"
    | "units"
    | "minDate"
    | "maxDate"
    | "onCancel"
    | "onConfirm"
  > = {},
) {
  const { maskClosable = true, onCancel, ...rest } = options;

  // 防止动画结束前重复触发 close（双击确认/取消、close 后再点遮罩等场景）
  let closing = false;
  let close: (() => Promise<void>) | undefined;
  const requestClose = () => {
    if (closing) return;
    closing = true;
    close?.();
  };

  close = showDialog({
    type: "pullUp",
    blankClosable: maskClosable,
    // 点击空白时同步补发 onCancel 通知（关闭动画并行进行）
    onBlankClick: () => {
      onCancel?.();
    },
    content: (
      <DatePicker {...rest} onCancel={onCancel} onClose={requestClose} />
    ),
  });
}
