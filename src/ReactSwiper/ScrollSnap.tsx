/** @jsx jsx */
import { jsx } from "@emotion/core";
import Swiper, { SwiperOptions } from "swiper";
import { WidthProperty, HeightProperty } from "csstype";
import { HTMLAttributes, DetailedHTMLProps, useRef, useEffect } from "react";
import { reactSwiperStyle } from "./style";

export interface ScrollSnapProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  width?: WidthProperty<number>;
  height?: HeightProperty<number>;
  children?: React.ReactNode;
  swiperOption?: SwiperOptions;
  extra?: React.ReactNode;
}

export function ScrollSnap(props: ScrollSnapProps) {
  let {
    width,
    height,
    children,
    swiperOption = {},
    extra,
    ...attributes
  } = props;

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof swiperOption === "object") {
      swiperOption = {
        ...{
          touchEventsTarget: "container",
          direction: "vertical",
          slidesPerView: "auto",
          freeMode: true,
          mousewheel: true,
          freeModeSticky: true,
          centeredSlides: true
        },
        ...swiperOption
      };
    }

    const swiper = new Swiper(container.current!, swiperOption);
    return () => {
      swiper.destroy(true, true);
    };
  });

  const showChildren = () => {
    const list = Array.isArray(children) ? children : [children];
    return list.map((item, index) => {
      return (
        <div key={index} className="swiper-slide">
          {item}
        </div>
      );
    });
  };

  return (
    <div css={[reactSwiperStyle, { width, height }]} {...attributes}>
      <div
        css={{ width: "100%", height: "100%" }}
        className="swiper-container"
        ref={container}
      >
        <div className="swiper-wrapper">{showChildren()}</div>
        {extra}
      </div>
    </div>
  );
}
