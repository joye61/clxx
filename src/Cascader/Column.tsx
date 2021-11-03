/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useEffect, useRef, useLayoutEffect } from "react";
import { style } from "./style";
import Swiper from "swiper";
import { RowCenter } from "../Flex/Row";
import { swiperStyle } from "./swiperStyle";

export interface ColumnItem {
  label: React.ReactNode;
  value: string | number;
}

export interface ColumnProps {
  // 选项列表
  columnOptions: ColumnItem[];
  // 展示时默认显示的索引
  defaultValue?: string | number;
  // 根据当前选中值更新Columns项
  updateColumns: (value: string | number) => void;
}

export function Column(props: ColumnProps) {
  const { columnOptions, defaultValue, updateColumns } = props;
  const swiperRef = useRef<HTMLDivElement | null>(null);

  const usedColumnOptions = useRef(columnOptions);
  // usedColumnOptions.current在组件在内存中更新完毕之时更新，此时onSlideChange(真实渲染完毕之后触发)内部的usedColumnOptions.current会拿到正确的值
  useLayoutEffect(() => {
    usedColumnOptions.current = columnOptions;
  }, [columnOptions]);

  // 获取初始索引,只在初始化时被执行一次
  const getInitialSlide = useCallback<() => number>(() => {
    let initialSlide = 0;
    if (Array.isArray(columnOptions)) {
      let findIndex = columnOptions.findIndex((option) => option.value === defaultValue);
      if (findIndex >= 0) {
        initialSlide = findIndex;
      }
    }
    return initialSlide;
  }, [columnOptions, defaultValue]);

  //  避免observerUpdate内的slideTo触发onSlideChange
  const transitionEnd = useRef(true);

  useEffect(() => {
    var swiper = new Swiper(swiperRef.current!, {
      initialSlide: getInitialSlide(),
      direction: "vertical",
      slidesPerView: 5,
      centeredSlides: true,
      freeMode: true,
      freeModeSticky: true,
      // 监听子组件内容变化
      observer: true,
    });
    swiper.on("slideChange", () => {
      if (!transitionEnd.current) {
        return;
      }
      const selectedValue = usedColumnOptions.current[swiper.realIndex]?.value;
      updateColumns(selectedValue);
    });
    // 内容更新时滚回到第一项
    swiper.on("observerUpdate", () => {
      transitionEnd.current = false;
      swiper.slideTo(0, 0, false);
      transitionEnd.current = true;
    });
    return () => {
      swiper.destroy();
    };
  }, []);

  return (
    <div css={[swiperStyle, style.body]}>
      <div className="swiper" ref={swiperRef} css={style.swiper}>
        <div className="swiper-wrapper">
          {columnOptions.map((item) => {
            return (
              <RowCenter className="swiper-slide" key={item.value}>
                {item.label}
              </RowCenter>
            );
          })}
        </div>
        <div css={[style.mask, style.maskTop]}></div>
        <div css={[style.mask, style.maskBottom]}></div>
      </div>
    </div>
  );
}
