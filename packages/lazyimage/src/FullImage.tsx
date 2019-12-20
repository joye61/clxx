/** @jsx jsx */
import { jsx } from "@emotion/core";
import { LazyImageProps, LazyImage } from ".";

/**
 * 自动占满容器宽度的LazyLoad图片
 * @param props
 */
export function FullImage(props: LazyImageProps) {
  const lazyProps = { ...props };
  lazyProps.width = "100%";
  return (
    <div css={{ fontSize: 0 }}>
      <LazyImage {...lazyProps} />
    </div>
  );
}
