/** @jsx jsx */
import { jsx, ObjectInterpolation } from "@emotion/core";
import { WidthProperty, HeightProperty } from "csstype";
import { useEffect, useState, useRef } from "react";
import { imageShow } from "./style";
import { normalizeUnit, splitValue } from "../cssUtil";

export type FillMode =
  | "cover"
  | "contain"
  | "fill"
  | "fill-width"
  | "fill-height";

export interface LazyImageProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  src: string;
  width?: WidthProperty<number>;
  height?: HeightProperty<number>;
  mode?: FillMode;
  alt?: string;
  /**
   * 是否是圆形的，圆形要求width和height一致，两个值都需要传
   */
  rounded?: boolean;
  /**
   * 图片未加载完成时的
   */
  placeholder?: React.ReactNode & string;
  /**
   * 是否淡入图片
   */
  fadeIn?: boolean;
  /**
   * 图片淡入时长
   */
  fadeDuration?: number | string;
}

export interface ImageInfo {
  src?: string;
  width?: number | string;
  height?: number | string;
  containerWidth?: number | string;
  containerHeight?: number | string;
}

export function LazyImage(props: LazyImageProps) {
  let {
    src,
    alt = "",
    width,
    height,
    fadeIn = true,
    fadeDuration = 400,
    rounded = false,
    mode = "fill",
    placeholder = null,
    onLoad = () => {},
    onError = () => {},
    ...attributes
  } = props;

  // 数值单位标准化
  width = normalizeUnit(width);
  height = normalizeUnit(height);

  /**
   * 图片信息
   */
  const [info, setInfo] = useState<ImageInfo>({
    // 初始化时不加载图片，设为undefined
    src: undefined,
    width,
    height,
    containerWidth: width,
    containerHeight: height
  });

  const containerRef = useRef<HTMLDivElement>(null);

  type Handle = (sw: number, sh: number) => void;
  const handler: Handle = (sw, sh) => {
    if (!width && !height) {
      // 宽高都没有指定，默认容器尺寸等于图片原始尺寸，mode无效
      setInfo({
        src,
        width: sw,
        height: sh
      });
    } else if (width && !height) {
      // 指定了宽度，高度没有指定，高度自适应，mode无效
      setInfo({ ...info, src, width: "100%" });
    } else if (!width && height) {
      // 指定了高度，没有指定宽度，宽度自适应，mode无效
      setInfo({ ...info, src, height: "100%" });
    } else {
      const iw = splitValue(width!);
      const ih = splitValue(height!);
      // 宽度和高度都指定了，此时mode模式生效，默认：mode=fill
      switch (mode) {
        case "cover":
          // 图片的最小边能覆盖容器的最长边
          if (iw.num / sw > ih.num / sh) {
            // 扩大宽度
            setInfo({ ...info, src, width: "100%", height: undefined });
          } else {
            // 扩大高度
            setInfo({ ...info, src, width: undefined, height: "100%" });
          }
          break;
        case "contain":
          // 图片的最长边能覆盖容器的最长边
          if (iw.num / sw > ih.num / sh) {
            // 扩大宽度
            setInfo({ ...info, src, width: undefined, height: "100%" });
          } else {
            // 扩大高度
            setInfo({ ...info, src, width: "100%", height: undefined });
          }
          break;
        case "fill-width":
          // 宽度始终填充容器的100%
          setInfo({ ...info, src, width: "100%", height: undefined });
          break;
        case "fill-height":
          // 高度始终填充容器的100%
          setInfo({ ...info, src, width: undefined, height: "100%" });
          break;
        default:
          // 默认模式和mode=fill等价，这种模式下，图片会发生变形
          setInfo({ ...info, src, width: "100%", height: "100%" });
          break;
      }
    }
  };

  const handleRef = useRef<Handle>(handler);
  useEffect(() => {
    handleRef.current = handler;
  });

  useEffect(() => {
    /**
     * 创建一个临时加载对象
     */
    const image = new Image();
    image.src = src;

    /**
     * 加载成功处理函数
     */
    const loadHandler = (event: Event) => {
      // 在下一个渲染周期渲染图片
      window.setTimeout(() => {
        typeof onLoad === "function" && onLoad(event as any);
        handleRef.current(image.width, image.height);
      }, 0);
    };

    /**
     * 加载失败处理函数
     */
    const errorHandler = (event: Event) => {
      typeof onError === "function" && onError(event as any);
    };
    image.addEventListener("load", loadHandler);
    image.addEventListener("error", errorHandler);

    /**
     * 执行理论可能存在的清理逻辑
     */
    return () => {
      image.removeEventListener("load", loadHandler);
      image.removeEventListener("error", errorHandler);
    };
  }, [src]);

  /**
   * 图片元素的样式
   */
  const imageStyle: ObjectInterpolation<any> = {
    width: info.width,
    height: info.height
  };
  if (fadeIn) {
    imageStyle.animation = `${imageShow} ${normalizeUnit(
      fadeDuration,
      "ms"
    )} ease-in`;
  }

  /**
   * 容器元素的样式
   */
  const containerStyle: ObjectInterpolation<any> = {
    display: "inline-block",
    position: "relative",
    overflow: "hidden",
    flexGrow: 0,
    flexShrink: 0,
    fontSize: 0,
    width: info.containerWidth,
    height: info.containerHeight
  };
  if (rounded && info.containerWidth === info.containerHeight) {
    containerStyle.borderRadius = "50%";
  }

  return (
    <div ref={containerRef} css={containerStyle} {...attributes}>
      {typeof info.src === "string" && info.src ? (
        <img
          css={imageStyle}
          src={info.src}
          alt={typeof alt === "string" ? alt : ""}
        />
      ) : (
        placeholder
      )}
    </div>
  );
}
