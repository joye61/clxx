// 检测passive模式是否被支持
export let passiveSupported = false;
try {
  const options = Object.defineProperty({}, "passive", {
    get: function() {
      passiveSupported = true;
    }
  });
  window.addEventListener("testpassive", null, options);
} catch (err) {}

// 禁止移动端默认滚动功能
document.documentElement.addEventListener(
  "touchstart",
  e => {
    e.preventDefault();
  },
  passiveSupported ? { passive: false } : false
);

// 检测是否支持Touch事件
export let isTouchSupport =
  typeof window.ontouchstart === "undefined" ? false : true;

// 获取transform样式属性的react属性名
export function getReactTransformAttr() {
  const list = {
    webkit: "Webkit",
    moz: "Moz",
    ms: "ms",
    o: "O"
  };
  if (typeof document.body.style.transform === "string") {
    return "transform";
  }

  for (const prefix in list) {
    if (typeof document.body.style[`${prefix}Transform`] === "string") {
      return `${list[prefx]}Transform`;
    }
  }
}
