import { getDomElement } from "../domUtil";
import { is } from "../is";

/**
 * 预览图片
 * @param target 预览图片目标
 */
export function preview(target: DOMElement) {
  const img = getDomElement(target);
  if (is.null(img)) {
    throw new Error("Preview target does not exist");
  }

  if (!(img instanceof Image)) {
    throw new Error("You can only preview image type objects");
  }
}
