/** @jsx jsx */
import { jsx, Interpolation } from "@emotion/core";
import { WidthProperty, HeightProperty } from "csstype";
import { useEffect, useState, useRef } from "react";
import { styles } from "./style";
import { normalizeUnit } from "../cssUtil";

export interface LazyImageProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  src: string;
  width: WidthProperty<number>;
  height: HeightProperty<number>;
  alt?: string;
  rounded?: boolean;
  placeholder?: React.ReactNode & string;
  fadeIn?: boolean;
  /**
   * 是否在DOM渲染之后立即加载
   * true: 立即加载
   * false: 会等到出现在屏幕视窗之后才开始加载
   */
  loadImmediately?: boolean;
}

export function LazyImage(props: LazyImageProps) {
  const [source, setSource] = useState<string | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  let {
    src,
    alt = "",
    width,
    height,
    fadeIn = true,
    rounded = false,
    loadImmediately = true,
    ...attributes
  } = props;

  const containerStyle: Interpolation<any> = [
    styles.container,
    { width: normalizeUnit(width), height: normalizeUnit(height) }
  ];
  if (rounded && width === height) {
    containerStyle.push({ borderRadius: "50%" });
  }

  useEffect(() => {
    const image = new Image();
    image.src = src;
    const onload = () => setSource(src);
    image.onload = onload;
    image.onerror = onload;
  }, [src]);

  /**
   * 图片占位标记
   */
  let placeholder: React.ReactNode = null;
  if (typeof props.placeholder !== "undefined") {
    placeholder = props.placeholder;
  }

  /**
   * 内容
   */
  let content: React.ReactNode = placeholder;
  if (typeof source === "string" && source) {
    const imageStyle = [styles.image];
    if (fadeIn) {
      imageStyle.push(styles.imageFadeIn);
    }
    content = (
      <img
        css={imageStyle}
        src={source}
        alt={typeof alt === "string" ? alt : ""}
      />
    );
  }

  return (
    <div ref={containerRef} css={containerStyle} {...attributes}>
      {content}
    </div>
  );
}
