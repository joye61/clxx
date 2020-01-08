/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Row, ColCenter } from "@clxx/layout";
import { style } from "./CascadeStyle";
import { CascadeProps, CascadeDataItem, CascadeResult } from "./types";
import { useEffect, useState, useRef } from "react";
import {
  ensureDataSource,
  ensureValue,
  getListByValue,
  getNewValue,
  getResultByValue
} from "./util";
import { ScrollContent } from "@clxx/picker/build/ScrollContent";
import { Controls } from "@clxx/picker/build/Controls";

/**
 * 级联选择器核心UI
 * @param props
 */
export function Cascade(props: CascadeProps) {
  const { title, data, onConfirm, defaultValue = [], ...controlProps } = props;

  /**
   * 初始数据源
   */
  const initData = ensureDataSource(data);
  const dataSource = useRef<Array<CascadeDataItem>>(initData);

  const getNewList = (
    newValue: number[],
    oldValue: number[],
    oldList: Array<React.ReactElement[]>
  ) => {
    // 获取开始不同的位置
    let diffIndex = -1;
    for (let i = 0; i < newValue.length; i++) {
      // 初始化时value是没有值的
      if (!oldValue[i]) {
        break;
      }
      // 如果新值和旧值不一样，此处就是不同位置
      if (oldValue[i] !== newValue[i]) {
        diffIndex = i;
        break;
      }
    }

    // 获取新列表
    const newList = getListByValue(newValue, dataSource.current);
    const result: Array<React.ReactElement[]> = [];
    for (let i = 0; i < newList.length; i++) {
      if (i <= diffIndex) {
        result.push(oldList[i]);
      } else {
        const changedList = newList[i].map((item, index) => {
          return (
            <p css={style.optionItem} key={item.name + index}>
              {item.name}
            </p>
          );
        });
        result.push(changedList);
      }
    }

    return result;
  };

  const initValue = ensureValue(defaultValue, initData);
  const initList = getNewList(initValue, [], []);

  const [value, setValue] = useState<number[]>(initValue);
  const [list, setList] = useState<Array<React.ReactElement[]>>(initList);

  /**
   * 根据数据源初始化picker
   */
  useEffect(() => {
    (async () => {
      dataSource.current = await ensureDataSource(data);
      const newValue = ensureValue(value, dataSource.current);
      setValue(newValue);
      setList(getNewList(newValue, value, list));
    })();
  }, [data]);

  const showPickerList = () => {
    return list.map((itemList, index) => {
      return (
        <ScrollContent
          list={itemList}
          key={index}
          selected={value[index]}
          onChange={(subIndex: number) => {
            const newValue = getNewValue(value, index, subIndex);
            setValue(newValue);
            setList(getNewList(newValue, value, list));
          }}
        />
      );
    });
  };

  const showTitle = () => {
    if (typeof title === "string") {
      return (
        <ColCenter css={style.defaultTitle}>
          <p>{title}</p>
        </ColCenter>
      );
    } else {
      return title;
    }
  };

  return (
    <div css={style.container} className="clxx-Cascade">
      <Controls
        onConfirm={() => {
          const result: CascadeResult = {
            index: value,
            value: getResultByValue(value, dataSource.current)
          };
          onConfirm?.(result);
        }}
        {...controlProps}
      >
        {showTitle()}
      </Controls>
      <Row css={style.content}>{showPickerList()}</Row>
    </div>
  );
}
