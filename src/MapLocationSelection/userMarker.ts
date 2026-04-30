// 用户当前位置 marker 的样式与 DOM 创建。
//
// === 中心对齐策略 ===
// 高德 AMap.Marker(content) 与百度 BMapGL.CustomOverlay 都允许塞任意 DOM 进来，
// 但两端的"DOM 锚点"机制完全不同——而且 BMapGL 在某些版本下 anchors / offsetX / offsetY
// 字段会被静默忽略（实测传 anchors=[0,0] 与 offsetY=6 都不生效），无法靠 SDK 参数把
// 12x12 的圆点中心对齐 point。
//
// 这里改用一个 SDK-无关的 trick：
//   - 外层 wrap 是 0x0 的"锚点容器"。任何 SDK 算锚点 / 偏移时，
//     由于 width=height=0，所有候选锚点（top-left / 底部中心 / 居中 / ...）都退化为同一点
//     —— 即 wrap 自身的左上角，也就是 point 在屏幕上的位置。
//   - 内层 .mls-user-loc（12x12）用 absolute + (-6, -6) 让自己几何中心对齐 wrap(0, 0)。
//
// 因此只要给 SDK 传"原始 point"、不传任何 offset / anchor，圆点中心就一定落在 point 上，
// 无需关心 SDK 实际默认锚点是 top-left 还是底部居中、字段名是否被识别。

const USER_LOC_STYLE_ID = "mls-user-loc-style";

export function ensureUserLocStyle() {
  if (typeof document === "undefined") return;
  if (document.getElementById(USER_LOC_STYLE_ID)) return;
  const styleEl = document.createElement("style");
  styleEl.id = USER_LOC_STYLE_ID;
  // 仅保留 dot / ripple 两个子元素的视觉样式：尺寸 / 位置 / 涟漪动画。
  // wrap 与 .mls-user-loc 的几何（width/height/position/left/top）全部由 createUserMarkerDom
  // 在创建 DOM 时 inline 写死，这里不再声明，避免外部 CSS 加载顺序导致几何抖动。
  styleEl.textContent = `
.mls-user-loc__dot {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 9px;
  height: 9px;
  margin-left: -4.5px;
  margin-top: -4.5px;
  border-radius: 50%;
  background-color: #4575F6;
  box-shadow: 0 0 0 1.5px #ffffff, 0 1px 2px rgba(0,0,0,0.25);
}
.mls-user-loc__ripple {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 9px;
  height: 9px;
  margin-left: -4.5px;
  margin-top: -4.5px;
  border-radius: 50%;
  background-color: #4575F6;
  opacity: 0.5;
  animation: mlsUserLocRipple 1.8s ease-out infinite;
}
@keyframes mlsUserLocRipple {
  0%   { transform: scale(1);   opacity: 0.5; }
  80%  { transform: scale(3.5); opacity: 0;   }
  100% { transform: scale(3.5); opacity: 0;   }
}
`;
  document.head.appendChild(styleEl);
}

export function createUserMarkerDom(): HTMLElement {
  ensureUserLocStyle();

  // wrap：0x0 锚点容器。所有几何相关字段都用 inline style 强制锁定，
  // 完全不依赖外部 .mls-user-loc-wrap 类（避免 CSS 加载顺序、SDK 内部覆写带来的干扰）。
  // SDK 内部可能把 position 改成 absolute——那也是 positioned，子元素 absolute 仍以
  // wrap 为参考；transform 也可能被 SDK 设置——不影响 wrap 自身 0x0 的 layout 尺寸。
  const wrap = document.createElement("div");
  wrap.style.position = "relative";
  wrap.style.width = "0";
  wrap.style.height = "0";
  wrap.style.padding = "0";
  wrap.style.margin = "0";
  wrap.style.border = "0";
  wrap.style.boxSizing = "content-box";
  wrap.style.pointerEvents = "none";

  // 真实可见的 marker：absolute -6/-6 让自身几何中心对齐 wrap(0, 0)
  const inner = document.createElement("div");
  inner.className = "mls-user-loc";
  inner.style.position = "absolute";
  inner.style.left = "-6px";
  inner.style.top = "-6px";
  inner.style.width = "12px";
  inner.style.height = "12px";
  inner.style.pointerEvents = "none";
  inner.innerHTML =
    '<span class="mls-user-loc__ripple"></span>' +
    '<span class="mls-user-loc__dot"></span>';

  wrap.appendChild(inner);
  return wrap;
}
