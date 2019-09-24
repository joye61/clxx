import { is } from "./is";

// 属性相关的vendor前缀
const propertyVendors = ["Webkit", "Moz", "ms", "O"];
// 函数相关的vendor前缀
const functionVendors = ["Webkit", "moz", "ms", "o"];

// 待检查的列表，这里只列举了本仓库中所常用的几个
const checkList = {
  transform: "Transform",
  animation: "Animation",
  animationcancel: "AnimationCancel",
  animationiteration: "AnimationIteration",
  animationend: "AnimationEnd",
  transition: "Transition",
  transitioncancel: "TransitionCancel",
  transitionend: "TransitionEnd",
  transitionrun: "TransitionRun",
  transitionstart: "TransitionStart"
};

export const compat = {};

Object.keys(checkList).forEach(checkName => {
  Object.defineProperty(compat, checkName, {
    enumerable: true,
    get() {
      let name: string = "";
      if (checkName.indexOf("transform") === 0) {
        name = "transform";
      } else if (checkName.indexOf("transition") === 0) {
        name = "transition";
      } else if (checkName.indexOf("animation") === 0) {
        name = "animation";
      }

      // 1、首先检查不用前缀是否可以通过验证
      if (is.string(document.body.style[name as any])) {
        return checkName;
      }

      // 2、其次检查添加前缀是否可以通过验证
      for (let vendor of propertyVendors) {
        name = vendor + (<any>checkList)[checkName];
        if (is.string(document.body.style[name as any])) {
          return vendor + (<any>checkList)[checkName];
        }
      }

      // 3、如果仍然没有找到，则返回undefined字符串
      return "undefined";
    }
  });
});
