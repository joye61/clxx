/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Controls } from "@clxx/picker/build/Controls";
import { ScrollContent } from "@clxx/picker/build/ScrollContent";
import { RowBetween } from "@clxx/layout";
import { style } from "./style";
import { CascadeProps, CascadeData } from "./types";
import { getLevel, getListBySelected } from "./util";
import { useState, useEffect } from "react";

export function Cascade(props: CascadeProps) {
  // 设置data的合法值
  const data: CascadeData = props.data ?? [];

  /**
   * 计算级联层级
   */
  const level = getLevel(data);
  /**
   * 计算初始化默认选中的索引
   */
  const initSelected: Array<number> = [];
  for (let i = 0; i < level; i++) {
    if (props.defaultSelected?.[i]) {
      initSelected.push(props.defaultSelected[i]);
    } else {
      initSelected.push(0);
    }
  }

  /**
   * 计算初始化列表
   */
  const initList = getListBySelected(data, initSelected);
  /**
   * 设置组件状态
   */
  const [selected, setSelected] = useState<Array<number>>(initSelected);
  const [list, setList] = useState<Array<Array<string | React.ReactElement>>>(
    initList
  );

  /**
   * 任意一列的索引发生了变化
   * @param index
   * @param subIndex
   */
  const onChange = (index: number, subIndex: number) => {
    /**
     * 首先更新索引
     */
    selected[index] = subIndex;
    // const newSelected = resetSelected(selected, fromIndex);
    const newSelected = selected.map((item, current) => {
      return current >= index + 1 ? 0 : item;
    });
    // console.log();
    setSelected(newSelected);

    /**
     * 其次更新关联列表
     */
    const changeList = getListBySelected(data, newSelected);
    // list.splice(index + 1, changeList.length, ...changeList);
    setList([...changeList]);
  };

  return (
    <div css={style.container}>
      <Controls></Controls>
      <RowBetween css={style.colGroup}>
        {list.map((col, index) => {
          return (
            <ScrollContent
              list={col}
              key={index}
              selected={selected[index]}
              onChange={(subIndex: number) => onChange(index, subIndex)}
            />
          );
        })}
      </RowBetween>
    </div>
  );
}
