/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useContext, useState, useRef, useEffect } from "react";
import { dpContext } from "./context";
import { getFinalValue, prefix0 } from "./util";
import { ScrollContent } from "@clxx/picker/build/ScrollContent";
import { Dayjs } from "dayjs";
import { Item } from "./Item";

function getMonthList() {
  const tempList: React.ReactElement[] = [];
  for (let month = 1; month <= 12; month++) {
    tempList.push(<Item value={prefix0(month)} unit="月" />);
  }
  return tempList;
}

function getMonthSelected(value: Dayjs) {
  let tempSelected = 0;
  let index = 0;
  for (let month = 1; month <= 12; month++) {
    if (value!.month() + 1 === month) {
      tempSelected = index;
    }
    index++;
  }
  return tempSelected;
}

export function Month() {
  const { min, max, value, setValue } = useContext(dpContext);

  /**
   * 月份列表的值是恒定的，永远不会变
   */
  const list = useRef<Array<string | React.ReactElement>>(getMonthList());
  const [selected, setSelected] = useState<number>(getMonthSelected(value!));

  /**
   * selected的值可能会变，因为有可能超过最大最小值
   */
  useEffect(() => {
    setSelected(getMonthSelected(value!));
    const finalValue = getFinalValue(value!, min!, max!);
    if (!finalValue.isSame(value!)) {
      setValue!(finalValue);
    }
  });

  /**
   * 月份值改变时的回调
   * @param index
   */
  const monthChange = (index: number) => {
    setValue!(value!.month(index));
  };

  return (
    <ScrollContent
      selected={selected}
      list={list.current}
      onChange={monthChange}
    />
  );
}
