/** @jsx jsx */
import { jsx, ObjectInterpolation } from "@emotion/core";
import { useRef, useState, useLayoutEffect } from "react";
import { useWindowResize } from "@clxx/effect";

export interface GridProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  children: React.ReactNode;
  /**
   * 表格中间的空白多大
   */
  gap: number | string;
  /**
   * 是否用空白环绕整个网格周围
   */
  gapSurround: boolean;
  /**
   * 表格的列数
   */
  column: number;
  /**
   * 表格是否方形
   */
  square: boolean;
}

type GridType = Array<Array<React.ReactNode>>;

export function Grid(props: Partial<GridProps>) {
  const [cellWidth, setCellWidth] = useState<number | undefined>(undefined);
  const gridRef = useRef<HTMLDivElement>(null);

  let {
    gap = 0,
    column = 2,
    square = false,
    gapSurround = true,
    children,
    className,
    ...attributes
  } = props;
  if (className) {
    className = `clxx-Grid ${className}`;
  }

  const getGrid = (): GridType => {
    // 用于存储元素的最终结果
    const result: GridType = [];

    /**
     * 根据子列表生成一个唯一的新列表
     * @param children
     */
    const getList = (children: React.ReactNode): Array<React.ReactNode> => {
      const list: Array<React.ReactNode> = [];

      if (typeof children === "function") {
        const fnResult: React.ReactNode = children();
        const fnList = getList(fnResult);
        list.push(...fnList);
      } else if (Array.isArray(children)) {
        for (let item of children) {
          const itemList = getList(item);
          list.push(...itemList);
        }
      } else {
        list.push(children);
      }

      return list;
    };

    /**
     * 将最后整理过的列表生成新的列表
     */
    const odList = getList(children);
    for (let item of odList) {
      const lastElement = result[result.length - 1];
      if (lastElement === undefined || lastElement.length === column) {
        result.push([item]);
      } else {
        lastElement.push(item);
      }
    }

    /**
     * 检查最后一个元素的完整性
     */
    const lastElement = result[result.length - 1];
    const lastLength = lastElement.length;

    // 如果最后一行的所有元素判定为false，移除最后一行
    let needFill = false;
    for (let litem of lastElement) {
      if (litem) {
        needFill = true;
        break;
      }
    }
    if (!needFill) {
      result.pop();
    }

    // 如果最后一样需要填充，则填充空白
    if (lastLength < column && needFill) {
      for (let i = 1; i <= column - lastLength; i++) {
        lastElement.push(null);
      }
    }
    return result;
  };

  /**
   * 获取列表数据
   */
  const gridList = getGrid();

  /**
   * 如果是方形的，需要设置方形属性
   */
  const showSquare = () => {
    if (square) {
      const cell = gridRef.current?.querySelector(".clxx-GridCol");
      if (cell instanceof Element) {
        setCellWidth(() => cell.getBoundingClientRect().width);
      }
    }
  };

  useLayoutEffect(showSquare, []);
  useWindowResize(showSquare);

  const gridStyle: ObjectInterpolation<any> = {};
  if (gapSurround) {
    gridStyle.padding = gap;
  }

  return (
    <div className={className} {...attributes} css={gridStyle} ref={gridRef}>
      {gridList.map((row, rowIndex) => {
        const rowStyle: ObjectInterpolation<any> = {
          display: "flex",
          flexDirection: "row"
        };
        if (rowIndex !== gridList.length - 1) {
          rowStyle.marginBottom = gap;
        }
        return (
          <div key={rowIndex} className="clxx-GridRow" css={rowStyle}>
            {row.map((col, colIndex) => {
              const colStyle: ObjectInterpolation<any> = {
                flexGrow: 1,
                flexShrink: 0,
                flexBasis: 0,
                alignItems: "stretch",
                position: "relative"
              };
              if (colIndex !== row.length - 1) {
                colStyle.marginRight = gap;
              }
              if (cellWidth) {
                colStyle.height = cellWidth;
              }
              return (
                <div key={colIndex} className="clxx-GridCol" css={colStyle}>
                  {col}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
