import { ReactSwiperProps, ReactSwiper } from ".";
import React from "react";

export function BannerSwiper(props: ReactSwiperProps) {
  let {
    children,
    showPagination = false,
    swiperOption = {},
    ...others
  } = props;

  if (Array.isArray(children) && children.length > 1) {
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
