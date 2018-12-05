import isPlainObject from "lodash/isPlainObject";

export default function rem(option) {
  // 设计尺寸，在html根元素指定data-dw
  const dw = document.documentElement.dataset.dw;
  let config = {
    criticalWidth: 576, // 移动和非移动临界点
    designWidth: dw ? parseInt(dw) : 750 // 设计尺寸
  };

  // 参数和默认选项合并
  if (isPlainObject(option)) {
    config = { ...config, option };
  }

  const reset = () => {
    const fontSize =
      window.innerWidth <= config.criticalWidth
        ? `${(window.innerWidth * 100) / config.designWidth}px`
        : `${(config.criticalWidth * 100) / config.designWidth}px`;

    document.documentElement.style.fontSize = fontSize;
  };

  window.onresize = reset;
  if (window.onorientationchange !== undefined) {
    window.onorientationchange = reset;
  }

  reset();
}
