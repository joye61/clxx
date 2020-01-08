/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useRef, DetailedHTMLProps, HTMLAttributes } from "react";
import { useEffectOnce } from "@clxx/effect";
import Swiper, { SwiperOptions } from "swiper";
import React from "react";
import { WidthProperty, HeightProperty } from "csstype";
import { reactSwiperStyle } from "./style";

export interface ReactSwiperProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  width?: WidthProperty<number>;
  height?: HeightProperty<number>;
  showPagination?: boolean;
  showNavigation?: boolean;
  showScrollBar?: boolean;
  children: React.ReactNode;
  swiperOption?: SwiperOptions;
}

export function ReactSwiper(props: ReactSwiperProps) {
  /**
   * 获取属性
   */
  const {
    width,
    height,
    children,
    showPagination = false,
    showNavigation = false,
    showScrollBar = false,
    swiperOption = {},
    ...attributes
  } = props;

  const container = useRef<HTMLDivElement>(null);
  const pagination = useRef<HTMLDivElement>(null);
  const prev = useRef<HTMLDivElement>(null);
  const next = useRef<HTMLDivElement>(null);
  const scrollbar = useRef<HTMLDivElement>(null);

  useEffectOnce(() => {
    if (children) {
      if (showPagination) {
        if (typeof swiperOption.pagination === "object") {
          swiperOption.pagination.el = pagination.current!;
        } else {
          swiperOption.pagination = { el: pagination.current! };
        }
      }
      if (showNavigation) {
        if (typeof swiperOption.navigation === "object") {
          swiperOption.navigation.prevEl = prev.current!;
          swiperOption.navigation.nextEl = next.current!;
        } else {
          swiperOption.navigation = {
            prevEl: prev.current!,
            nextEl: next.current!
          };
        }
      }
      if (showScrollBar) {
        if (typeof swiperOption.scrollbar === "object") {
          swiperOption.scrollbar.el = scrollbar.current!;
        } else {
          swiperOption.scrollbar = { el: scrollbar.current! };
        }
      }

      const swiper = new Swiper(container.current!, swiperOption);
      return () => {
        swiper.destroy(true, true);
      };
    }
  });

  const showChildren = () => {
    if (Array.isArray(children)) {
      return children.map((child, index) => {
        return (
          <div className="swiper-slide" key={index}>
            {child}
          </div>
        );
      });
    } else {
      return <div className="swiper-slide">{children}</div>;
    }
  };

  return children ? (
    <div css={[reactSwiperStyle, { width, height }]} {...attributes}>
      <div
        css={{ width: "100%", height: "100%" }}
        className="swiper-container"
        ref={container}
      >
        <div className="swiper-wrapper">{showChildren()}</div>
        {showPagination ? (
          <div className="swiper-pagination" ref={pagination}></div>
        ) : null}
        {showNavigation ? (
          <React.Fragment>
            <div className="swiper-button-prev" ref={prev}></div>
            <div className="swiper-button-next" ref={next}></div>
          </React.Fragment>
        ) : null}
        {showScrollBar ? (
          <div className="swiper-scrollbar" ref={scrollbar}></div>
        ) : null}
      </div>
    </div>
  ) : null;
}
