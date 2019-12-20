/** @jsx jsx */
import { jsx, css } from "@emotion/core";

import { ReactSwiperProps, ReactSwiper } from ".";
import { SwiperOptions } from "swiper";

export function PageView(props: ReactSwiperProps) {
  let { children, swiperOption, ...others } = props;
  let defaultOption: SwiperOptions = {
    direction: "vertical"
  };
  if (typeof swiperOption === "object") {
    defaultOption = { ...defaultOption, ...swiperOption };
  }

  const showChildren = () => {
    const styles = css({
      position: "relative",
      width: "100%",
      height: "100%",
      overflow: "hidden"
    });

    if (Array.isArray(children)) {
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
