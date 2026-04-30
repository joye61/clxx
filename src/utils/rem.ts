// 把 750 设计稿下的像素值转成响应式 css 长度。
//
// 库内组件统一使用 r() 表达尺寸，不再写 ".28rem" 字面量——这样即便用户在
// Container 上传入非 750 的 designWidth（如 375 / 1080），库内组件的视觉比例
// 仍然按 750 设计稿计算，不会被放大或缩小。
//
// 实现原理：依赖 Container 注入的 --clxx-px 变量。
//   - --clxx-px 的语义是「750 设计稿下的 1px 在当前视口下渲染成多少 css px」
//     即 --clxx-px = clamp(viewport, maxWidth) / 750（单位 px）
//   - r(28) → calc(28 * var(--clxx-px, 1px))
//             视口 750 时 = 28px
//             视口 375 时 = 14px
//             视口 1080（无 maxWidth）时 = 40.32px
//             —— 与原 ".28rem" 在默认 designWidth=750 + 同视口下完全一致
//
// fallback 1px：用户未挂 Container 时（或 SSR 首屏未注入 :root 变量），
// calc 不会因 var() 解析失败而整体 invalid，组件至少能以 750 设计稿原像素显示，
// 不会坍缩成 width:auto / padding:0。
//
// 与「写字面 rem」相比的关键差异：
//   - rem 字面量受 html font-size 影响，html font-size 由 Container 按
//     **用户的** designWidth 计算 —— 用户改 designWidth=375 时库内 rem 视觉翻倍；
//   - r() 走独立 CSS 变量 --clxx-px，与用户 designWidth 完全解耦，永远稳。
//
// 性能：calc/var 是 specified→computed 一次求值，结果进 computed style 缓存，
// 不会每帧重算。同 px 值复用同一字符串实例（cache），减少 GC 压力，emotion
// className hash 命中率也更高。
//
// @param px750 在 750 设计稿下的像素值
// @returns css 长度字符串，可直接喂给 emotion css 对象 / 模板字符串 / 内联 style
//
// @example
//   // before
//   const style = css({ padding: ".2rem .32rem" });
//   // after
//   const style = css({ padding: `${r(20)} ${r(32)}` });
const cache = new Map<number, string>();

export function r(px750: number): string {
  const cached = cache.get(px750);
  if (cached !== undefined) return cached;
  const value = `calc(${px750} * var(--clxx-px, 1px))`;
  cache.set(px750, value);
  return value;
}
