import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { DatePickerStyle } from "./style";

export interface ColumnProps {
  items: number[];
  value: number;
  onChange: (v: number) => void;
  format?: (n: number) => string;
  style: DatePickerStyle;
}

// === 物理参数（统一阻尼-弹簧模型）===
// 释放后整段运动是「单一连续 ODE」：摩擦 + 弹簧（朝预测落点），由 rAF 步进。
// 既无双阶段切换，也不存在「等惯性停 → 启动吸附」的间隙。
// 单位：位置 px、时间 ms、速度 px/ms、加速度 px/ms²

// 摩擦系数：用于「预测最终落点」。指数衰减下 v(t)=v0·e^(-kt)，落点 = offset0 + v0/k
const FRICTION_K = 0.005;
// 弹簧刚度：朝目标项的回正力度。ω = sqrt(STIFF) ≈ 0.0134 rad/ms ≈ 470ms 周期
const STIFF = 0.00018;
// 阻尼比 1.0 = 临界阻尼（无超调，最快稳态）
const DAMP_RATIO = 1.0;
const DAMPING = 2 * Math.sqrt(STIFF) * DAMP_RATIO;
// 边界橡皮筋：手指拖到边界外，offset 实际变化按此比例（iOS 风格）
const RUBBER = 0.45;
// 越界回弹：边界吸引到内边的强弹簧
const EDGE_STIFF = 0.0006;
const EDGE_DAMP = 2 * Math.sqrt(EDGE_STIFF);

// 终止阈值
const EPS_V = 0.02; // px/ms
const EPS_X = 0.5; // px

export function Column(props: ColumnProps) {
  const { items, value, onChange, format, style } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [itemHeight, setItemHeight] = useState(0);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, items.indexOf(value)),
  );

  // refs 让 rAF 闭包始终读到最新值
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const targetRef = useRef(0);
  const animRef = useRef(0);
  const lastFrameRef = useRef(0);
  // 缓存上一次 activeIndex，避免每帧 setState 调度开销
  const lastActiveRef = useRef(-1);

  const valueRef = useRef(value);
  valueRef.current = value;
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const itemHeightRef = useRef(itemHeight);
  itemHeightRef.current = itemHeight;

  // === 测量 itemHeight（随 rem 变化）===
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const measure = () => {
      const first = el.querySelector<HTMLDivElement>("[data-pick-item]");
      if (first) {
        const h = first.getBoundingClientRect().height;
        if (h > 0) setItemHeight(h);
      }
    };
    measure();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, []);

  // === 渲染辅助 ===
  const applyTransform = (offset: number) => {
    const inner = innerRef.current;
    if (inner) inner.style.transform = `translate3d(0,${-offset}px,0)`;
  };

  const updateActive = (offset: number) => {
    const ih = itemHeightRef.current;
    if (ih === 0) return;
    const list = itemsRef.current;
    const idx = Math.max(
      0,
      Math.min(list.length - 1, Math.round(offset / ih)),
    );
    if (lastActiveRef.current === idx) return;
    lastActiveRef.current = idx;
    setActiveIndex(idx);
  };

  const setOffsetImmediate = (offset: number) => {
    offsetRef.current = offset;
    applyTransform(offset);
    updateActive(offset);
  };

  const stopAnimation = () => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = 0;
    }
  };

  // === 物理动画循环 ===
  const startAnimation = () => {
    stopAnimation();
    lastFrameRef.current = performance.now();
    const step = (now: number) => {
      // dt 上限 32ms：防止页面切回时大跳，导致一帧位移过大
      const dt = Math.min(32, now - lastFrameRef.current);
      lastFrameRef.current = now;
      const ih = itemHeightRef.current;
      const list = itemsRef.current;
      if (ih === 0 || list.length === 0) {
        animRef.current = 0;
        return;
      }
      const maxOffset = (list.length - 1) * ih;
      let offset = offsetRef.current;
      let velocity = velocityRef.current;
      const target = targetRef.current;

      // 越界判断：使用边界弹簧把 offset 拉回 [0, maxOffset]
      let outOfBound = 0;
      if (offset < 0) outOfBound = offset;
      else if (offset > maxOffset) outOfBound = offset - maxOffset;

      let acc: number;
      if (outOfBound !== 0) {
        // 越界期间用更强的边界弹簧；忽略原 target，先回到合法范围
        acc = -EDGE_STIFF * outOfBound - EDGE_DAMP * velocity;
      } else {
        acc = -STIFF * (offset - target) - DAMPING * velocity;
      }

      velocity += acc * dt;
      offset += velocity * dt;

      offsetRef.current = offset;
      velocityRef.current = velocity;
      applyTransform(offset);
      updateActive(offset);

      const settled =
        Math.abs(velocity) < EPS_V &&
        Math.abs(offset - target) < EPS_X &&
        outOfBound === 0;
      if (settled) {
        // 精确对齐到 target（target 已是 itemH 整数倍）
        offsetRef.current = target;
        velocityRef.current = 0;
        applyTransform(target);
        updateActive(target);
        const idx = Math.round(target / ih);
        const v = list[idx];
        if (v !== valueRef.current) onChangeRef.current(v);
        animRef.current = 0;
        return;
      }
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
  };

  // 释放：用速度预测落点 → 吸附到最近 item → 启动物理动画
  const releaseWithVelocity = (v: number) => {
    const ih = itemHeightRef.current;
    const list = itemsRef.current;
    if (ih === 0 || list.length === 0) return;
    const maxOffset = (list.length - 1) * ih;
    // 摩擦预测：落点 = 当前 + v / k（指数衰减积分）
    const projected = offsetRef.current + v / FRICTION_K;
    const clamped = Math.max(0, Math.min(maxOffset, projected));
    const idx = Math.max(0, Math.min(list.length - 1, Math.round(clamped / ih)));
    targetRef.current = idx * ih;
    velocityRef.current = v;
    startAnimation();
  };

  // === 手势处理 ===
  useEffect(() => {
    const el = containerRef.current;
    if (!el || itemHeight === 0) return;

    let dragging = false;
    let lastY = 0;
    let lastTime = 0;
    // 手势起点：用「起点 offset + 累计位移」重算每帧位置，
    // 避免越界橡皮筋反馈振荡（上一帧衰减后的 offset 不能再作为下一帧起点）
    let startOffset = 0;
    let totalDelta = 0;
    // 速度采样：保留最近若干帧用于释放速度估算
    let samples: { dy: number; dt: number; t: number }[] = [];

    const onDown = (clientY: number) => {
      stopAnimation();
      dragging = true;
      lastY = clientY;
      lastTime = performance.now();
      startOffset = offsetRef.current;
      totalDelta = 0;
      samples = [];
      velocityRef.current = 0;
    };

    const onMove = (clientY: number) => {
      if (!dragging) return;
      const ih = itemHeightRef.current;
      const list = itemsRef.current;
      if (ih === 0) return;
      const maxOffset = (list.length - 1) * ih;
      const now = performance.now();
      // 屏幕向下拖（dy>0）== 列表向下平移 == offset 减少
      const dy = clientY - lastY;
      const delta = -dy;
      totalDelta += delta;
      // 「原始位置」不受衰减影响：始终 = 起点 + 累计位移
      const rawPos = startOffset + totalDelta;
      // 只对越界部分衰减，避免衰减后的值反馈到下一帧产生振荡
      let next: number;
      if (rawPos < 0) {
        next = rawPos * RUBBER;
      } else if (rawPos > maxOffset) {
        next = maxOffset + (rawPos - maxOffset) * RUBBER;
      } else {
        next = rawPos;
      }
      offsetRef.current = next;
      applyTransform(next);
      updateActive(next);
      const dt = Math.max(1, now - lastTime);
      samples.push({ dy: delta, dt, t: now });
      // 只保留最近 100ms 的样本
      const cutoff = now - 100;
      while (samples.length > 0 && samples[0].t < cutoff) samples.shift();
      lastY = clientY;
      lastTime = now;
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      // 释放速度：最近 100ms 样本的总位移 / 总时间（px/ms）
      // 等价于近 100ms 的平均速度，比单帧速度更稳，能滤掉手指最后一瞬的抖动
      let totalDy = 0;
      let totalDt = 0;
      for (const s of samples) {
        totalDy += s.dy;
        totalDt += s.dt;
      }
      const v = totalDt > 0 ? totalDy / totalDt : 0;
      releaseWithVelocity(v);
    };

    // touch
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      onDown(e.touches[0].clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      // 阻止页面滚动（touch-action: none 已防大部分，再保险）
      if (e.cancelable) e.preventDefault();
      onMove(e.touches[0].clientY);
    };
    const onTouchEnd = () => onUp();

    // mouse（document 级监听 move/up，避免拖出元素丢事件）
    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      onDown(e.clientY);
    };
    const onMouseMove = (e: MouseEvent) => onMove(e.clientY);
    const onMouseUp = () => onUp();

    // wheel：直接累加到 offset，停止后启动 0 速度回弹（=纯弹簧吸附最近项）
    let wheelTimer: ReturnType<typeof setTimeout> | 0 = 0;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      stopAnimation();
      const ih = itemHeightRef.current;
      const list = itemsRef.current;
      if (ih === 0) return;
      const maxOffset = (list.length - 1) * ih;
      let next = offsetRef.current + e.deltaY;
      // 滚轮不做橡皮筋（多余），直接夹到合法范围
      next = Math.max(0, Math.min(maxOffset, next));
      offsetRef.current = next;
      velocityRef.current = 0;
      applyTransform(next);
      updateActive(next);
      if (wheelTimer) clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        wheelTimer = 0;
        releaseWithVelocity(0);
      }, 80);
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);
    el.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
      el.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("wheel", onWheel);
      if (wheelTimer) clearTimeout(wheelTimer);
      stopAnimation();
    };
  }, [itemHeight]);

  // === 同步外部 value（含首次 itemHeight 测量） ===
  // 用 useLayoutEffect 避免首帧闪烁（在浏览器绘制前同步 transform）
  useLayoutEffect(() => {
    const ih = itemHeightRef.current;
    if (ih === 0) return;
    const idx = items.indexOf(value);
    if (idx < 0) return;
    const target = idx * ih;
    if (Math.abs(offsetRef.current - target) > 0.5) {
      stopAnimation();
      velocityRef.current = 0;
      setOffsetImmediate(target);
    }
  }, [value, items, itemHeight]);

  return (
    <div ref={containerRef} css={style.column}>
      <div ref={innerRef} css={style.columnInner}>
        <div css={style.spacer} />
        {items.map((v, i) => (
          <div
            key={v}
            data-pick-item
            css={[style.item, i === activeIndex && style.itemActive]}
          >
            {format ? format(v) : v}
          </div>
        ))}
        <div css={style.spacer} />
      </div>
    </div>
  );
}
