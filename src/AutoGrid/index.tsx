import { Interpolation, Theme } from '@emotion/react';
import React, { useCallback } from 'react';
import CSS from 'csstype';
import { style } from './style';
import { normalizeUnit } from '../utils/cssUtil';

export interface AutoGridOption extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode;
  // 容器的样式
  containerStyle?: Interpolation<Theme>;
  // 元素之间空白槽的宽度
  gap?: CSS.Property.Width;
  // 列的数目
  cols?: number;
  // 是否显示正方形
  isSquare?: boolean;
  // 元素容器的样式
  itemStyle?: Interpolation<Theme>;
}

/**
 * 自动化生成表格
 * @param props
 */
export function AutoGrid(props: AutoGridOption) {
  const {
    children,
    cols: rawCols = 1,
    gap: rawGap = 0,
    isSquare = false,
    itemStyle,
    containerStyle,
    ...extra
  } = props;

  // 规范化数字单位
  const cols = +rawCols;
  const gap = normalizeUnit(rawGap) as string;

  // 获取表格数据
  const getGridData = useCallback(() => {
    // 生成一个能创建表格的二维数组
    let list: Array<React.ReactNode[]> = [];
    React.Children.forEach(children, (child) => {
      if (child !== null) {
        if (list.length === 0 || list[list.length - 1].length >= cols) {
          list.push([]);
        }
        list[list.length - 1].push(child);
      }
    });
    return list;
  }, [children]);

  // 元素的最终样式
  const finalItemBoxStyle: Interpolation<Theme> = [
    style.itemBoxStyle,
    {
      marginRight: gap,
      width: `calc((100% - ${cols - 1} * ${gap}) / ${cols})`,
    },
  ];

  /**
   * 显示内容
   */
  const showContent = () => {
    const gridData = getGridData();
    return gridData.map((row, rowIndex) => {
      // 每行的槽样式，最后一行没有
      let finalRowStyle: Interpolation<Theme> = [
        style.rowStyle,
        rowIndex !== gridData.length - 1 ? { marginBottom: gap } : {}
      ];

      return (
        <div key={rowIndex} css={finalRowStyle}>
          {row.map((item, colIndex) => {
            let finalCss: Interpolation<Theme> = [
              ...finalItemBoxStyle,
              itemStyle
            ];

            if (isSquare) {
              return (
                <div css={[...finalCss, style.itemBoxSquare]} key={colIndex}>
                  <div css={style.itemInnerStyle}>{item}</div>
                </div>
              );
            } else {
              return (
                <div css={finalCss} key={colIndex}>
                  {item}
                </div>
              );
            }
          })}
        </div>
      );
    });
  };

  return (
    <div {...extra} css={[containerStyle]}>
      {showContent()}
    </div>
  );
}
