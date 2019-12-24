/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useContext, useRef, useState, useEffect } from "react";
import { dpContext } from "./context";
import { getFinalValue, prefix0 } from "./util";
import { ScrollContent } from "@clxx/picker/build/ScrollContent";
import { Dayjs } from "dayjs";
import { Item } from "./Item";

export type HISMode = "h" | "i" | "s";

function getList(end: number, mode: HISMode) {
  const tempList: React.ReactElement[] = [];
  for (let num = 0; num <= end; num++) {
    let unit: string = "";
    switch (mode) {
      case "h":
        unit = "时";
        break;
      case "i":
        unit = "分";
        break;
      case "s":
        unit = "秒";
        break;
      default:
        break;
    }
    tempList.push(<Item value={prefix0(num)} unit={unit} />);
  }
  return tempList;
}

function getSelected(end: number, mode: HISMode, value: Dayjs) {
  let tempSelected = 0;
  let index = 0;
  for (let i = 0; i <= end; i++) {
    if (
      (mode === "h" && value!.hour() === i) ||
      (mode === "i" && value!.minute() === i) ||
      (mode === "s" && value!.second() === i)
    ) {
      tempSelected = index;
    }
    index++;
  }
  return tempSelected;
}

export function HIS(props: { mode: HISMode }) {
  const mode = props.mode;

  let end: number = 0;
  if (mode === "h") {
    end = 23;
  } else if (mode === "i") {
    end = 59;
  } else if (mode === "s") {
    end = 59;
  }

  const { min, max, value, setValue } = useContext(dpContext);

  const list = useRef<Array<string | React.ReactElement>>(getList(end, mode));
  const [selected, setSelected] = useState<number>(
    getSelected(end, mode, value!)
  );

  /**
   * 被选择项有可能会改变
   */
  useEffect(() => {
    setSelected(getSelected(end, mode, value!));

    const finalValue = getFinalValue(value!, min!, max!);
    if (!finalValue.isSame(value!)) {
      setValue!(finalValue);
    }
  });

  const onChange = (index: number) => {
    if (mode === "h") {
      const changed = value!.hour(index);
      setValue!(changed);
    } else if (mode === "i") {
      const changed = value!.minute(index);
      setValue!(changed);
    } else if (mode === "s") {
      const changed = value!.second(index);
      setValue!(changed);
    }
  };

  return (
    <ScrollContent
      selected={selected}
      list={list.current}
      onChange={onChange}
    />
  );
}
