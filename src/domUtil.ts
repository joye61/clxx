import { is } from "./is";

/**
 * 根据参数类型获取对应的DOM元素
 * @param target 
 */
export function getDomElement(target?: DOMElement): Element | null {
  if (is.undefined(target)) {
    return null;
  }

  if (is.string(target)) {
    const possibleElement = document.querySelector(target);
    return is.element(possibleElement) ? possibleElement : null;
  }

  if (is.element(target)) {
    return target;
  }

  return null;
}
