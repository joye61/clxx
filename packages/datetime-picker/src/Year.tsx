/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useContext, useState, useEffect, useRef } from "react";
import { dpContext } from "./context";
import { getFinalValue } from "./util";
import { ScrollContent } from "@clxx/picker/build/ScrollContent";
import { Dayjs } from "dayjs";
import { Item } from "./Item";

/**
 * 根据最大最小值获取一个年份列表
 * @param min
 * @param max
 */
function getYearList(min: Dayjs, max: Dayjs) {
  const start = min!.year();
  const end = max!.year();
  const tempList: React.ReactElement[] = [];
  for (let year = start; year <= end; year++) {
    tempList.push(<Item value={year} unit="年" />);
  }
  return tempList;
}

/**
 * 获取当前选中值
 * @param min
 * @param max
 * @param value
 */
function getYearSelected(min: Dayjs, max: Dayjs, value: Dayjs) {
  const start = min!.year();
  const end = max!.year();
  let tempSelected = 0;
  let index = 0;
  for (let year = start; year <= end; year++) {
    if (value!.year() === year) {
      tempSelected = index;
      break;
    }
    index++;
  }
  return tempSelected;
}

export function Year() {
  const { min, max, value, setValue } = useContext(dpContext);

  // 年份列表和selected是不可变的
  const list = useRef<Array<string | React.ReactElement>>(
    getYearList(min!, max!)
  );
  const selected = useRef<number>(getYearSelected(min!, max!, value!));

  /**
   * 年份改变时触发函数
   * @param index
   */
  const yearChange = (index: number) => {
    const changed = value!.year(min!.year() + index);
    setValue!(getFinalValue(changed, min!, max!));
  };

  return (
    <ScrollContent
      selected={selected.current}
      list={list.current}
      onChange={yearChange}
      className="clxx-dtp-year"
    />
  );
}
