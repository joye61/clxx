/** @jsx jsx */
import { jsx } from "@emotion/core";
import { style } from "./ScrollContentStyle";
import { useRef, useEffect } from "react";
import Swiper from "swiper";
import debounce from "lodash/debounce";
import React from "react";

export type PickerChangeFunc = (index: number) => void;

export interface ScrollContentProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  selected?: number;
  list?: Array<string | React.ReactElement>;
  onChange?: PickerChangeFunc & any;
  debounceDuration?: number;
}

export function ScrollContent(props: ScrollContentProps) {
  const {
    selected = 0,
    list = [],
    debounceDuration = 100,
    onChange,
    ...attributes
  } = props;

  const container = useRef<HTMLDivElement>(null);
  const swiper = useRef<Swiper>(null);

  /**
   * 将change监听器移除依赖，同时保持最新
   */
  const changeRef = useRef<PickerChangeFunc | undefined>(onChange);
  useEffect(() => {
    changeRef.current = onChange;
  });

  /**
   * 初始化swiper实例
   */
  useEffect(() => {
    (swiper as any).current = new Swiper(container.current!, {
      initialSlide: props.selected || 0,
      touchEventsTarget: "container",
      direction: "vertical",
      slidesPerView: "auto",
      freeMode: true,
      freeModeMomentum: true,
      mousewheel: true,
      freeModeSticky: true,
      centeredSlides: true,
      touchMoveStopPropagation: true,
      a11y: {
        enabled: false
      }
    });

    /**
     * slideChangeTransitionEnd 在低速滚动时出现不会每次都触发
     * 此处用transitionEnd代替，并添加触发条件，防止无效消耗
     */
    let lastSlideIndex = swiper.current!.realIndex;
    const transitionEnd = debounce(
      () => {
        if (
          typeof changeRef.current === "function" &&
          swiper.current!.realIndex !== lastSlideIndex
        ) {
          changeRef.current(swiper.current!.realIndex);
        }
        lastSlideIndex = swiper.current!.realIndex;
      },
      props.debounceDuration || 100,
      {
        leading: false,
        trailing: true
      }
    );
    swiper.current!.on("transitionEnd", transitionEnd);

    /**
     * 组件被销毁时清除逻辑
     */
    return () => {
      swiper.current!.off("transitionEnd", transitionEnd);
      swiper.current!.destroy(true, true);
    };
  }, []);

  /**
   * 更新当前选中的选项
   */
  useEffect(() => {
    if (swiper.current instanceof Swiper) {
      swiper.current.slideTo(props.selected!);
    }
  }, [props.selected]);

  /**
   * 列表更新时重新计算尺寸值
   */
  useEffect(() => {
    if (swiper.current instanceof Swiper) {
      swiper.current!.update();
    }
  }, [props.list]);

  /**
   * 生成列表
   */
  const showList = () => {
    return props.list?.map((item, index) => {
      let child = item;
      if (!React.isValidElement(item)) {
        child = <p className="swiper-slide-text">{item}</p>;
      }
      return (
        <div className="swiper-slide" key={index}>
          {child}
        </div>
      );
    });
  };

  return (
    <div css={style.container} {...attributes}>
      <div className="swiper-container" ref={container}>
        <div className="swiper-wrapper">{showList()}</div>
        <div css={style.mask}></div>
      </div>
    </div>
  );
}
