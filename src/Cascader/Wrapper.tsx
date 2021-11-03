/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { RowBetween } from "../Flex/Row";
import { style } from "./style";
import { Column, ColumnItem } from "./Column";
import useUpdate from "../Effect/useUpdate";

export interface CascaderOption {
  label: React.ReactNode;
  value: string | number;
  children?: CascaderOption[];
}

type defaultValue = (string | number)[];

export interface WrapperProps {
  // 选项列表
  options: CascaderOption[];
  // 默认选中项
  defaultValue: defaultValue;
  // 选项改变时触发
  onSelect: (selectValue: defaultValue) => void;
  // 定制取消按钮
  renderCancel?: React.ReactNode | (() => React.ReactNode);
  // 定制确认按钮
  renderConfirm?: React.ReactNode | (() => React.ReactNode);
  // 定制标题栏
  renderTitle?: React.ReactNode | (() => React.ReactNode);
  // 确认按钮点击回调
  onConfirm?: (selectValue: defaultValue) => void;
  // 取消按钮点击回调
  onCancel?: () => void;
}

export function Wrapper(props: WrapperProps) {
  const { options, defaultValue, onSelect, renderTitle, renderCancel, renderConfirm } = props;

  const update = useUpdate();

  // 当前选中的值
  let selectedValueArray = useRef<defaultValue>(Array.isArray(defaultValue) ? defaultValue : []);
  //   待渲染项，每一项渲染一个Column组件（Swiper组件）
  const currentColumns = useRef<ColumnItem[][]>([]);

  // 获取options的最大深度以及所有子树
  const { maxDepth, subOptionsRecord } = useMemo(() => {
    let subOptionsRecord: Record<string, CascaderOption[]> = {};
    let maxDepth: number = 1;
    const traverse = (options: CascaderOption[], currentDepth: number) => {
      options.forEach((option) => {
        if (Array.isArray(option.children) && option.children.length >= 1) {
          subOptionsRecord[option.value] = option.children;
          maxDepth = Math.max(currentDepth + 1, maxDepth);
          traverse(option.children, currentDepth + 1);
        }
      });
    };
    traverse(options, 1);
    return { maxDepth, subOptionsRecord };
  }, [options]);

  // 常量函数，根据options以及初始值获取初始渲染列
  const getInitColumns = useCallback((options: CascaderOption[], selectedValue: defaultValue) => {
    // 待渲染的Columns项,每一项最终渲染一个Column组件(独立的Swiper组件)
    let initColumns: ColumnItem[][] = [options.map((item) => ({ value: item.value, label: item.label }))];
    // 当前待搜索的子项
    let currentSubOption: CascaderOption[] = options;

    // 根据初始值获取下一次的子项
    for (let i = 0; i < maxDepth - 1; i++) {
      let currentValue = selectedValue[i];
      let nextIndex = currentSubOption.findIndex((item) => item.value === currentValue);
      // 没有找到就取第一项作为下一次的子项
      let nextSubOption = currentSubOption[nextIndex === -1 ? 0 : nextIndex]?.children || [];

      initColumns.push(
        nextSubOption.map((item) => ({
          value: item.value,
          label: item.label,
        }))
      );
      currentSubOption = nextSubOption;
    }
    return initColumns;
  }, []);

  // 选项列表或初始值更新时，重新计算当前渲染项
  useEffect(() => {
    selectedValueArray.current = Array.isArray(defaultValue) ? defaultValue : [];
    currentColumns.current = getInitColumns(options, selectedValueArray.current);
    update();
  }, [options, defaultValue]);

  // 更新columns项，触发onSelect回调
  const updateColumnsAndSelectedValues = useCallback((value: string | number, index: number) => {
    let usedTree: CascaderOption[] = subOptionsRecord[value];
    // index之前的默认值不变
    let updateValueArray: defaultValue = selectedValueArray.current.slice(0, index);
    updateValueArray.push(value);
    // index+1之前的columns不变
    let updateCurrentColumns: ColumnItem[][] = currentColumns.current.slice(0, index + 1);
    for (let i = 0; i < maxDepth - index - 1; i++) {
      if (!usedTree) {
        updateCurrentColumns.push([]);
        continue;
      }
      updateValueArray.push(usedTree[0].value);
      updateCurrentColumns.push(usedTree.map((item) => ({ value: item.value, label: item.label })));
      usedTree = subOptionsRecord[usedTree[0].value];
    }
    // 更新当前选中值
    selectedValueArray.current = updateValueArray;
    // 触发onSelect回调
    onSelect?.(updateValueArray);
    // 更新渲染项
    currentColumns.current = updateCurrentColumns;
    update();
  }, []);

  const showRenderContent = (render: React.ReactNode | (() => React.ReactNode), defaultContent: React.ReactNode) => {
    return typeof render === "function" ? render() ?? defaultContent : render ?? defaultContent;
  };

  return (
    <div css={[style.container]}>
      <RowBetween css={style.header}>
        <div css={style.title}>{showRenderContent(renderTitle, "")}</div>
        <div
          css={[style.btn, style.btnCancel]}
          onClick={() => {
            props.onCancel?.();
          }}
        >
          {showRenderContent(renderCancel, "取消")}
        </div>
        <div
          css={[style.btn, style.btnConfirm]}
          onClick={() => {
            props.onConfirm?.(selectedValueArray.current);
          }}
        >
          {showRenderContent(renderConfirm, "确认")}
        </div>
      </RowBetween>
      <RowBetween>
        {currentColumns.current.map((column, index) => {
          return (
            <Column
              updateColumns={(value: string | number) => {
                updateColumnsAndSelectedValues(value, index);
              }}
              columnOptions={column}
              // defaultValue实际上只有初始化时有效
              defaultValue={selectedValueArray.current[index]}
              key={index}
            />
          );
        })}
      </RowBetween>
    </div>
  );
}
