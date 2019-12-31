/** @jsx jsx */
import { jsx, SerializedStyles, css, ObjectInterpolation } from "@emotion/core";
import { useRef, useEffect, useState } from "react";
import { style } from "./AutoGridStyle";
import { splitValue } from "@clxx/base";
import { useWindowResize } from "@clxx/effect";

export interface AutoGridProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  /**
   * 网格的空白区域尺寸，空白区域是等宽的
   */
  gap?: number | string;
  /**
   * 网格的列数
   */
  col?: number;
  /**
   * 网格的元素自动高度，默认所有个网格都是方形的
   */
  autoHeight?: boolean;
  /**
   * 网格的元素列表
   */
  children?: React.ReactNode;
}

export function AutoGrid(props: AutoGridProps) {
  let {
    gap = 0,
    col = 1,
    autoHeight = false,
    children,
    ...attrributes
  } = props;

  // 保证表格至少有一列
  if (col < 1 || typeof col !== "number") {
    col = 1;
  }

  const container = useRef<HTMLDivElement>(null);
  const [list, setList] = useState<Array<React.ReactNode[]>>([]);
  const [size, setSize] = useState<SerializedStyles | undefined>(undefined);

  const computeSize = () => {
    const rect = container.current!.getBoundingClientRect();
    const { num, unit } = splitValue(gap);
    const itemWidth = (rect.width - (col - 1) * num) / col;
    let itemHeight: string | undefined = undefined;
    if (!autoHeight) {
      itemHeight = itemWidth + unit;
    }
    // 更新元素的尺寸信息
    setSize(css({ width: itemWidth + unit, height: itemHeight }));
  };

  /**
   * 计算元素的尺寸
   */
  useEffect(computeSize, [children, gap, col]);
  useWindowResize(computeSize);

  /**
   * 生成表格列表
   */
  useEffect(() => {
    if (!children) {
      return;
    }

    const list: Array<React.ReactNode[]> = [];
    const pushList = (arr: any[]) => {
      arr.forEach(item => {
        if (!item) {
          return;
        }
        if (Array.isArray(item)) {
          pushList(item);
          return;
        }
        if (list.length === 0) {
          list.push([item]);
        } else {
          const tail = list[list.length - 1];
          if (tail.length < col) {
            tail.push(item);
          } else {
            list.push([item]);
          }
        }
      });
    };

    if (Array.isArray(children)) {
      pushList(children);
    } else {
      pushList([children]);
    }

    // 更新列表
    setList(list);
  }, [children, col]);

  /**
   * 显示表格逻辑
   */
  const showRows = () => {
    return list.map((row, index) => {
      const rowStlyle: Array<SerializedStyles | undefined> = [style.row];
      if (index < list.length - 1) {
        rowStlyle.push(
          css({
            marginBottom: gap
          })
        );
      }
      return (
        <div key={index} css={rowStlyle}>
          {row.map((item, colIndex) => {
            // 设置每一个表格元素的尺寸和空白
            const margin: ObjectInterpolation<any> = {
              marginRight: gap
            };
            if (colIndex === col - 1) {
              margin.marginRight = 0;
            }
            const colStyle: Array<SerializedStyles | undefined> = [
              style.col,
              size,
              css(margin)
            ];
            return (
              <div key={colIndex} css={colStyle}>
                {item}
              </div>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div ref={container} {...attrributes}>
      {showRows()}
    </div>
  );
}
