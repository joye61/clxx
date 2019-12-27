/** @jsx jsx */
import { jsx, SerializedStyles, css } from "@emotion/core";
import dayjs, { Dayjs, ConfigType } from "dayjs";
import { createCalendarTable } from "./util";
import { style } from "./style";
import { useState, useEffect, useRef } from "react";
import { useWindowResize, useEffectOnce } from "@clxx/effect";
import React from "react";

export interface CalendarProps {
  showWeekDayTitle?: boolean;
  renderTitleItem?: (index?: number, name?: string) => React.ReactNode;
  renderItem?: (date: Dayjs) => React.ReactNode;
  date?: ConfigType;
  startFromSunday?: boolean;
  sizeGuarantee?: boolean;
  onChange?: (date?: Dayjs, isSelect?: boolean) => void;
}

export function Calendar(props: CalendarProps) {
  let {
    renderTitleItem,
    renderItem,
    date = dayjs(),
    showWeekDayTitle = true,
    startFromSunday = false,
    sizeGuarantee = true
  } = props;

  if (typeof renderTitleItem === "undefined") {
    renderTitleItem = (index?: number, name?: string) => {
      return (
        <div css={[style.defaultCommon, style.defaultTitleItem]}>{name}</div>
      );
    };
  }

  if (typeof renderItem === "undefined") {
    renderItem = (item: Dayjs) => {
      let styles = [style.defaultCommon, style.defaultItem];

      /**
       * 非本月的数据灰显
       */
      if (item.month() !== dayjs(date).month()) {
        styles.push(style.defaultItemGray);
      } else {
        styles.push(style.defaultItemMonth);
      }

      // 默认显示的逻辑
      let child: React.ReactNode = item.date();

      /**
       * 显示今天
       */
      if (item.isSame(dayjs(), "date")) {
        child = (
          <div css={style.defaultToday}>
            <span>{child}</span>
            <span>今天</span>
          </div>
        );
      }

      /**
       * 判断当前是否选中
       */
      if(selectDate && item.isSame(selectDate, "date")) {
        styles.push(style.defaultSelected);
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
          return (
            <div
              key={item.valueOf()}
              css={[style.item, itemHeight]}
              onClick={() => {
                setSelectDate(item);
              }}
            >
              {renderItem!(item)}
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
