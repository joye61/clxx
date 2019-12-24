/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useContext, useState, useEffect, useRef } from "react";
import { dpContext } from "./context";
import { getFinalValue, prefix0 } from "./util";
import { ScrollContent } from "@clxx/picker/build/ScrollContent";
import { Dayjs } from "dayjs";
import { Item } from "./Item";

function getDayList(end: number) {
  const tempList: React.ReactElement[] = [];
  for (let day = 1; day <= end; day++) {
    tempList.push(<Item value={prefix0(day)} unit="日" />);
  }
  return tempList;
}

function getDaySelected(value: Dayjs) {
  const end = value!.endOf("month").date();
  let tempSelected = 0;
  let index = 0;
  for (let date = 1; date <= end; date++) {
    if (value!.date() === date) {
      tempSelected = index;
    }
    index++;
  }
  return tempSelected;
}

export function Day() {
  const { min, max, value, setValue } = useContext(dpContext);

  const [list, setList] = useState<Array<string | React.ReactElement>>(
    getDayList(value!.endOf("month").date())
  );
  const [selected, setSelected] = useState<number>(getDaySelected(value!));
  const lastDayOfMonth = useRef<number>(value!.endOf("month").date());

  /**
   * 天数列表和当前选择都可能会变
   */
  useEffect(() => {
    setSelected(getDaySelected(value!));
    const lastDay = value!.endOf("month").date();
    if (lastDayOfMonth.current !== lastDay) {
      lastDayOfMonth.current = lastDay;
      setList(getDayList(lastDay));
    }

    const finalValue = getFinalValue(value!, min!, max!);
    if (!finalValue.isSame(value!)) {
      setValue!(finalValue);
    }
  });

  const dayChange = (index: number) => {
    setValue!(value!.date(1 + index));
  };

  return <ScrollContent selected={selected} list={list} onChange={dayChange} />;
}
