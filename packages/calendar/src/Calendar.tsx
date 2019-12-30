/** @jsx jsx */
import { jsx, SerializedStyles, css } from "@emotion/core";
import dayjs, { Dayjs, ConfigType } from "dayjs";
import { createCalendarTable } from "./util";
import { style } from "./style";
import { useState, useEffect, useRef } from "react";
import { useWindowResize, useEffectOnce } from "@clxx/effect";
import React from "react";

export interface ItemStatus {
  isSelect?: boolean;
  isToday?: boolean;
  isOutOfMonth?: boolean;
}

export interface CalendarProps {
  // 是否显示星期几标题栏
  showWeekDayTitle?: boolean;
  // 渲染星期几标题栏每一项内容
  renderTitleItem?: (index?: number, name?: string) => React.ReactNode;
  // 渲染表格每一项内容
  renderItem?: (date: Dayjs, status?: ItemStatus) => React.ReactNode;
  // 初始化时传入的日期，以月为基准，默认为当前月
  date?: ConfigType;
  // 是否以星期天为第一列，默认星期天为最后一列
  startFromSunday?: boolean;
  // 是否保证行数尺寸，默认始终显示6行
  sizeGuarantee?: boolean;
  // 单元格被选中时触发的事件
  onSelect?: (date?: Dayjs) => void;
  // 灰显的单元格是否可以响应交互，如点击等
  outOfMonthDisabled?: boolean;
}

export function Calendar(props: CalendarProps) {
  let {
    renderTitleItem,
    renderItem,
    onSelect,
    date = dayjs(),
    showWeekDayTitle = true,
    startFromSunday = false,
    sizeGuarantee = true,
    outOfMonthDisabled = true
  } = props;

  if (typeof renderTitleItem === "undefined") {
    renderTitleItem = (index?: number, name?: string) => {
      return (
        <div css={[style.defaultItemCommon, style.defaultTitleItem]}>
          {name}
        </div>
      );
    };
  }

  if (typeof renderItem === "undefined") {
    renderItem = (item: Dayjs, status?: ItemStatus) => {
      let styles = [style.defaultItemCommon, style.defaultItem];

      // 不是当月的数据灰显
      if (status?.isOutOfMonth) {
        styles.push(style.defaultItemOutOfMonth);
      } else {
        styles.push(style.defaultItemMonth);
      }

      // 判断当前日期是否选中
      if (status?.isSelect) {
        styles.push(style.defaultSelected);
      }

      // 默认显示的逻辑
      let child: React.ReactNode = item.date();
      // 显示今天
      if (status?.isToday) {
        styles.push(style.defaultToday);
        child = (
          <React.Fragment>
            {child}
            <span>今天</span>
          </React.Fragment>
        );
      }

      return <div css={styles}>{child}</div>;
    };
  }

  const [selectDate, setSelectDate] = useState<undefined | Dayjs>(undefined);
  const [itemHeight, setItemHeight] = useState<SerializedStyles | undefined>(
    undefined
  );
  const container = useRef<HTMLDivElement>(null);

  const updateItemHeight = () => {
    const width = container.current!.getBoundingClientRect().width;
    setItemHeight(() => {
      return css({ height: width / 7 });
    });
  };

  const updateRef = useRef<() => void>(updateItemHeight);
  useEffect(() => {
    updateRef.current = updateItemHeight;
  });

  // 页面尺寸变化时更新元素尺寸
  useWindowResize(updateItemHeight);
  // 初始化完成也更新一次元素尺寸
  useEffectOnce(updateItemHeight);

  /**
   * 生成表格数据
   */
  const tableData = createCalendarTable(date, startFromSunday, sizeGuarantee);
  const table = tableData.map((row: Array<Dayjs>, index) => {
    // 生成表格数据
    return (
      <div key={index} css={[style.row]}>
        {row.map((item: Dayjs) => {
          /**
           * 当前选项的状态
           */
          const status: ItemStatus = {
            isSelect: selectDate && item.isSame(selectDate, "date"),
            isToday: item.isSame(dayjs(), "date"),
            isOutOfMonth: item.month() !== dayjs(date).month()
          };

          return (
            <div
              key={item.valueOf()}
              css={[style.item, itemHeight]}
              onClick={() => {
                const outOfMonth = item.month() !== dayjs(date).month();
                if (!outOfMonth || !outOfMonthDisabled) {
                  onSelect?.(item);
                  setSelectDate(item);
                }
              }}
            >
              {renderItem!(item, status)}
            </div>
          );
        })}
      </div>
    );
  });

  /**
   * 显示星期几的标题信息
   */
  const showTitle = () => {
    if (showWeekDayTitle) {
      let title = ["一", "二", "三", "四", "五", "六", "日"];
      if (startFromSunday) {
        title = ["日", "一", "二", "三", "四", "五", "六"];
      }
      return (
        <div css={[style.row]}>
          {title.map((name, index) => {
            return (
              <div key={name} css={[style.item, itemHeight]}>
                {renderTitleItem!(index, name)}
              </div>
            );
          })}
        </div>
      );
    }
  };

  return (
    <div ref={container}>
      {showTitle()}
      {table}
    </div>
  );
}
