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

// 检测是否支持Touch事件
export let isTouchSupport =
  typeof window.ontouchstart === "undefined" ? false : true;
