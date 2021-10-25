/** @jsx jsx */
import { jsx } from "@emotion/react";
import { RowBetween } from "../Flex/Row";
import { Col } from "../Flex/Col";
import { style } from "./style";
import { swiperStyle } from "./swiperStyle";
import { Clickable } from "../Clickable";
import Swiper from "swiper";
import React, { useCallback, useEffect, useRef, useState } from "react";

export type OptionType = {
  value: string | number;
  label?: React.ReactNode;
  [key: string]: any;
};

export interface PickerWrapperProps {
  // 选项列表
  options: OptionType[];
  // 展示时默认显示的索引
  defaultValue?: number;
  // 定制化的渲染选项
  renderOption?: (option: OptionType, index: number) => React.ReactNode;
  // 确认按钮点击回调
  onConfirm?: (option: OptionType, index: number) => void;
  // 取消按钮点击回调
  onCancel?: () => void;
  // 定制取消按钮
  renderCancel?: () => React.ReactNode;
  // 定制确认按钮
  renderConfirm?: () => React.ReactNode;
  // 显示标题栏
  showTitle?: boolean;
  // 定制标题栏
  renderTitle?: (option: OptionType, index: number) => React.ReactNode;
}

export function Wrapper(props: PickerWrapperProps) {
  const {
    onConfirm,
    onCancel,
    renderCancel,
    renderConfirm,
    options,
    renderOption,
    showTitle = true,
    renderTitle,
    defaultValue,
  } = props;

  // 获取初始索引
  const getInitialSlide = useCallback<() => number>(() => {
    let initialSlide = 0;
    if (Array.isArray(options)) {
      let findIndex = options.findIndex((option) => option.value === defaultValue);
      if (findIndex >= 0) {
        initialSlide = findIndex;
      }
    }
    return initialSlide;
  }, [options, defaultValue]);

  const swiperRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState<number>(getInitialSlide());

  useEffect(() => {
    const swiper = new Swiper(swiperRef.current!, {
      initialSlide: getInitialSlide(),
      direction: "vertical",
      slidesPerView: 5,
      centeredSlides: true,
      freeMode: true,
      freeModeSticky: true,
    });
    swiper.on("init", () => {
      setIndex(swiper.realIndex);
    });
    swiper.on("slideChange", () => {
      setIndex(swiper.realIndex);
    });

    return () => {
      swiper.destroy();
    };
  }, [getInitialSlide]);

  // 显示标题逻辑
  const showTitleContent = () => {
    if (showTitle) {
      const option = options[index];
      if (typeof renderTitle === "function") {
        return renderTitle(option, index);
      } else {
        return (
          <Col css={style.title}>
            <span>当前选择</span>
            <span>{option.label}</span>
          </Col>
        );
      }
    }
  };

  // 按钮逻辑
  const showCancel = () => {
    return renderCancel?.() ?? <div css={[style.btn, style.btnCancel]}>取消</div>;
  };
  const showConfirm = () => {
    return renderConfirm?.() ?? <div css={[style.btn, style.btnConfirm]}>确定</div>;
  };

  /**
   * 显示选项列表
   * @returns
   */
  const showOptions = () => {
    if (Array.isArray(options)) {
      return options.map((option, index) => {
        let content: React.ReactNode = option.label;
        if (typeof renderOption === "function") {
          content = renderOption(option, index);
        }
        return (
          <div className="swiper-slide" key={option.value}>
            {content}
          </div>
        );
      });
    }
  };

  return (
    <div css={[style.container]}>
      {/* 头部 */}
      <RowBetween css={style.header}>
        {showTitleContent()}
        <Clickable onClick={onCancel}>{showCancel()}</Clickable>
        <Clickable onClick={() => onConfirm?.(options[index], index)}>{showConfirm()}</Clickable>
      </RowBetween>
      {/* 滚动部分 */}
      <div css={[swiperStyle, style.body]}>
        <div className="swiper" css={style.swiper} ref={swiperRef}>
          {/* 选项列表 */}
          <div className="swiper-wrapper">{showOptions()}</div>
          {/* 遮罩部分 */}
          <div css={[style.mask, style.maskTop]} />
          <div css={[style.mask, style.maskBottom]} />
        </div>
      </div>
    </div>
  );
}
