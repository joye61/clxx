/** @jsx jsx */
import { jsx } from "@emotion/core";
import { style } from "./style";

export function Picker() {
  return (
    <div css={style}>
      <div className="swiper-container">
        <div className="swiper-wrapper">
          <div className="swiper-slide">Slide 1</div>
          <div className="swiper-slide">Slide 2</div>
          <div className="swiper-slide">Slide 3</div>
        </div>
      </div>
    </div>
  );
}
