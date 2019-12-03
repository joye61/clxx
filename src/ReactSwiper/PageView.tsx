/** @jsx jsx */
import { jsx, css } from "@emotion/core";

import { ReactSwiperProps, ReactSwiper } from ".";
import { SwiperOptions } from "swiper";
import { is } from "../is";

export function PageView(props: ReactSwiperProps) {
  let { children, swiperOption, ...others } = props;
  let defaultOption: SwiperOptions = {
    direction: "vertical"
  };
  if (is.plainObject(swiperOption)) {
    defaultOption = { ...defaultOption, ...swiperOption };
  }

  const showChildren = () => {
    const styles = css({
      position: "relative",
      width: "100%",
      height: "100%",
      overflow: "hidden"
    });

    if (is.array(children)) {
      return children.map((item, index) => {
        return (
          <div css={styles} key={index}>
            {item}
          </div>
        );
      });
    } else {
      return <div css={styles}>{children}</div>;
    }
  };

  return (
    <ReactSwiper height="100vh" swiperOption={defaultOption} {...others}>
      {showChildren()}
    </ReactSwiper>
  );
}
