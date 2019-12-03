import { ReactSwiperProps, ReactSwiper } from ".";
import React from "react";
import { is } from "../is";

export function BannerSwiper(props: ReactSwiperProps) {
  let {
    children,
    showPagination = false,
    swiperOption = {},
    ...others
  } = props;

  if (is.array(children) && children.length > 1) {
    swiperOption.loop = true;
  } else {
    showPagination = false;
  }

  return !!children ? (
    <ReactSwiper
      showPagination={showPagination}
      swiperOption={swiperOption}
      {...others}
    >
      {children}
    </ReactSwiper>
  ) : null;
}
