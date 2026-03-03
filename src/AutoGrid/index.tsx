import { Interpolation, Theme } from '@emotion/react';
import React, { useMemo } from 'react';
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

  // 规范化，确保 cols >= 1
  const cols = Math.max(1, Math.floor(+rawCols) || 1);
  const gap = normalizeUnit(rawGap) as string;

  // 将 children 分组为二维数组
  const gridData = useMemo(() => {
    const list: Array<React.ReactNode[]> = [];
    React.Children.forEach(children, (child) => {
      if (child !== null && child !== undefined) {
        if (list.length === 0 || list[list.length - 1].length >= cols) {
          list.push([]);
        }
        list[list.length - 1].push(child);
      }
    });
    // 用空占位符补齐最后一行，避免最后一行元素宽度不一致
    if (list.length > 0) {
      const lastRow = list[list.length - 1];
      while (lastRow.length < cols) {
        lastRow.push(null);
      }
    }
    return list;
  }, [children, cols]);

  // 缓存 item 宽度计算
  const itemWidth = useMemo(
    () => `calc((100% - ${cols - 1} * ${gap}) / ${cols})`,
    [cols, gap]
  );

  return (
    <div {...extra} css={containerStyle}>
      {gridData.map((row, rowIndex) => (
        <div
          key={rowIndex}
          css={[
            style.row,
            { gap },
            rowIndex !== gridData.length - 1 ? { marginBottom: gap } : undefined,
          ]}
        >
          {row.map((item, colIndex) => {
            const isPlaceholder = item === null;
            const boxCss: Interpolation<Theme> = [
              style.itemBox,
              { width: itemWidth },
              isPlaceholder ? { visibility: 'hidden' as const } : undefined,
              isSquare ? style.itemBoxSquare : undefined,
              itemStyle,
            ];

            return isSquare ? (
              <div css={boxCss} key={colIndex}>
                <div css={style.itemInner}>{item}</div>
              </div>
            ) : (
              <div css={boxCss} key={colIndex}>
                {item}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
