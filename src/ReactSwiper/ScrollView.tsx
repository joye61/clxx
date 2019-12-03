/**
 * 基于swiper的滚动容器，功能教弱，但特色是支持scroll snap模式
 */

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffectOnce } from "../Effect/useEffectOnce";
import Swiper, { SwiperOptions } from "swiper";
import { WidthProperty, HeightProperty } from "csstype";
import { HTMLAttributes, DetailedHTMLProps, useRef } from "react";
import { reactSwiperStyle } from "./style";
import { is } from "../is";

export interface ScrollViewProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  direction?: "vertical" | "horizontal";
  width?: WidthProperty<number>;
  height?: HeightProperty<number>;
  scrollSnap?: boolean;
  showScrollBar?: boolean;
  autoHideBar?: boolean;
  children: React.ReactNode;
}

export function ScrollView(props: ScrollViewProps) {
  const {
    width,
    height,
    direction = "vertical",
    scrollSnap = false,
    showScrollBar = false,
    autoHideBar = true,
    children,
    ...attributes
  } = props;

  const container = useRef<HTMLDivElement>(null);
  const scrollbar = useRef<HTMLDivElement>(null);

  useEffectOnce(() => {
    const option: SwiperOptions = {
      direction,
      slidesPerView: "auto",
      freeMode: true,
      mousewheel: true,
      freeModeSticky: scrollSnap
    };
    if (showScrollBar) {
      option.scrollbar = {
        el: scrollbar.current!,
        hide: !!autoHideBar
      };
    }

    const swiper = new Swiper(container.current!, option);

    return () => {
      swiper.destroy(true, true);
    };
  });

  const showChildren = () => {
    const list = is.array(children) ? children : [children];
    return list.map((item, index) => {
      return (
        <div
          css={{ height: "auto !important" }}
          key={index}
          className="swiper-slide"
        >
          {item}
        </div>
      );
    });
  };

  return (
    <div
      css={[
        reactSwiperStyle,
        { width, height },
        {
          ".swiper-scrollbar.cl-ScrollViewBar": {
            backgroundColor: "transparent",
            height: "100%",
            top: 0,
            right: 0,
            ".swiper-scrollbar-drag": {
              borderRadius: 0
            }
          }
        }
      ]}
      {...attributes}
    >
      <div
        css={{ width: "100%", height: "100%" }}
        className="swiper-container"
        ref={container}
      >
        <div className="swiper-wrapper">{showChildren()}</div>
        {showScrollBar ? (
          <div
            className="swiper-scrollbar cl-ScrollViewBar"
            ref={scrollbar}
          ></div>
        ) : null}
      </div>
    </div>
  );
}
