import { useEffect } from "react";
import isPlainObject from "lodash/isPlainObject";

export interface ViewportAttr {
  // 宽度
  width: "device-width" | number | string;
  // 高度
  height: "device-height" | number | string;
  // 最大缩放
  maximumScale: number;
  // 最小缩放
  minimumScale: number;
  // 是否可缩放
  userScalable: "yes" | "no";
  // 初始缩放比例
  initialScale: number;
  // 视口匹配
  viewportFit: "cover" | "contain" | "auto";
}

export const metaContent = {
  /**
   * 解析meta的content字段
   * @param content
   * @returns
   */
  parse(content: string): Record<string, string | number> {
    content = content.replace(/\s+|,$/g, "");
    if (!content) return {};
    const parts = content.split(",");
    const output: Record<string, string> = {};
    for (let part of parts) {
      const arr = part.split("=");
      output[arr[0]] = arr[1];
    }
    return output;
  },

  /**
   * 生成meta的content字段
   * @param data
   * @returns
   */
  stringify(data: Record<string, string | number>): string {
    const parts: string[] = [];
    for (let key in data) {
      const part = `${key}=${data[key]}`;
      parts.push(part);
    }
    return parts.join(", ");
  },
};

export function useViewport(attr?: Partial<ViewportAttr>) {
  let config: Partial<ViewportAttr> = {
    width: "device-width",
    initialScale: 1,
    userScalable: "no",
    viewportFit: "cover",
  };
  if (isPlainObject(attr)) {
    config = { ...config, ...attr };
  }
  useEffect(() => {
    // 确保viewport的合法逻辑
    let meta: HTMLMetaElement | null = document.querySelector("meta[name='viewport']");
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "viewport";
      document.head.prepend(meta);
    }

    const content: Record<string, string | number> = metaContent.parse(meta.content || "");
    if (config.width) {
      content.width = config.width;
    }
    if (config.height) {
      content.height = config.height;
    }
    if (config.maximumScale) {
      content["maximum-scale"] = config.maximumScale;
    }
    if (config.minimumScale) {
      content["minimum-scale"] = config.minimumScale;
    }
    if (config.initialScale) {
      content["initial-scale"] = config.initialScale;
    }
    if (config.userScalable) {
      content["user-scalable"] = config.userScalable;
    }
    if (config.viewportFit) {
      content["viewport-fit"] = config.viewportFit;
    }

    meta.content = metaContent.stringify(content);

    console.log(content, meta.content);
  }, [
    config.width,
    config.height,
    config.initialScale,
    config.maximumScale,
    config.minimumScale,
    config.userScalable,
    config.viewportFit,
  ]);
}
