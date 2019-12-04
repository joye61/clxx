/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffectOnce } from "../Effect/useEffectOnce";
import Swiper, { SwiperOptions } from "swiper";
import { WidthProperty, HeightProperty } from "csstype";
import { HTMLAttributes, DetailedHTMLProps, useRef } from "react";
import { reactSwiperStyle } from "./style";
import { is } from "../is";

export interface ScrollSnapProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  direction?: "vertical" | "horizontal";
  width?: WidthProperty<number>;
  height?: HeightProperty<number>;
  children: React.ReactNode;
}

export function ScrollSnap(props: ScrollSnapProps) {
  const {
    width,
    height,
    direction = "vertical",
    children,
    ...attributes
  } = props;

  const container = useRef<HTMLDivElement>(null);

  useEffectOnce(() => {
    const option: SwiperOptions = {
      direction,
      slidesPerView: "auto",
      freeMode: true,
      mousewheel: true,
      freeModeSticky: true,
      freeModeMomentumRatio: 1.2
    };

    const swiper = new Swiper(container.current!, option);
    return () => {
      swiper.destroy(true, true);
    };
  });

  const showChildren = () => {
    const list = is.array(children) ? children : [children];
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
      </div>
    </div>
  );
}
