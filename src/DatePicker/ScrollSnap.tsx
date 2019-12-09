/** @jsx jsx */
import { jsx } from "@emotion/core";
import { reactSwiperStyle } from "../ReactSwiper/style";
import { maskStyle, style } from "./style";
import React, { useRef, useEffect } from "react";
import { prefix0 } from "./util";
import { RowCenter } from "../Layout/Row";
import Swiper from "swiper";
import debounce from "lodash/debounce";

export type changeFunc = (index: number) => void;
export type Mode = "y" | "m" | "d" | "h" | "i" | "s";

export interface ScrollSnapProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  start: number;
  end: number;
  slideIndex?: number;
  mode: Mode;
  onIndexChange?: changeFunc;
}

const unitMap = {
  y: "年",
  m: "月",
  d: "日",
  h: "时",
  i: "分",
  s: "秒"
};

export function ScrollSnap(props: ScrollSnapProps) {
  let {
    start,
    end,
    slideIndex = 0,
    mode,
    onIndexChange,
    ...attributes
  } = props;

  const list: React.ReactNode[] = [];
  for (let i = start; i <= end; i++) {
    list.push(
      <div className="swiper-slide" key={i}>
        <RowCenter css={style.item}>
          {prefix0(i)}
          <span css={style.unit}>{unitMap[mode]}</span>
        </RowCenter>
      </div>
    );
  }

  const container = useRef<HTMLDivElement>(null);
  const swiper = useRef<Swiper>(null);

  /**
   * 将change监听器移除依赖，同时保持最新
   */
  const slideIndexChange = useRef<changeFunc | undefined>(onIndexChange);
  useEffect(() => {
    slideIndexChange.current = onIndexChange;
  });

  /**
   * 初始化swiper实例
   */
  useEffect(() => {
    // 创建Swiper实例
    (swiper as any).current = new Swiper(container.current!, {
      // 只取重新初始化时的showIndex作为初始值
      initialSlide: slideIndex,
      touchEventsTarget: "container",
      direction: "vertical",
      slidesPerView: "auto",
      freeMode: true,
      mousewheel: true,
      freeModeSticky: true,
      centeredSlides: true,
      touchMoveStopPropagation: true,
      freeModeMomentumRatio: 0.5,
      freeModeMomentumBounceRatio: 0.5
    });

    /**
     * slideChangeTransitionEnd 在低速滚动时出现不会触发的bug
     * 此处用transitionEnd代替，并添加触发条件
     */
    let lastSlideIndex = swiper.current!.realIndex;
    const transitionEnd = debounce(
      () => {
        if (
          typeof slideIndexChange.current === "function" &&
          swiper.current!.realIndex !== lastSlideIndex
        ) {
          slideIndexChange.current(swiper.current!.realIndex);
        }
        lastSlideIndex = swiper.current!.realIndex;
      },
      100,
      {
        leading: false,
        trailing: true
      }
    );
    swiper.current!.on("transitionEnd", transitionEnd);

    /**
     * 清理swiper
     */
    return () => {
      swiper.current!.destroy(true, true);
    };
  }, []);

  useEffect(() => {
    if (swiper.current instanceof Swiper) {
      swiper.current!.update();
    }
  }, [start, end]);

  /**
   * 更新了显示的slideIndex
   */
  useEffect(() => {
    if (swiper.current instanceof Swiper) {
      swiper.current.slideTo(slideIndex);
    }
  }, [slideIndex]);

  return (
    <div css={[reactSwiperStyle, style.swiperContainer]} {...attributes}>
      <div
        className="swiper-container"
        css={style.swiperInnerContainer}
        ref={container}
      >
        <div className="swiper-wrapper">{list}</div>
        <div css={maskStyle.container}>
          <div css={[maskStyle.item, maskStyle.item1]}></div>
          <div css={[maskStyle.item, maskStyle.item2]}></div>
          <div css={[maskStyle.item, maskStyle.item3]}></div>
        </div>
      </div>
    </div>
  );
}
