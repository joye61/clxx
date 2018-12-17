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
