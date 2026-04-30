import { Global, Interpolation, Theme } from "@emotion/react";
import {
  Fragment,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useWindowResize } from "../Effect/useWindowResize";
import { useViewport } from "../Effect/useViewport";

export interface ContainerProps {
  // 用户自定义的全局样式
  globalStyle?: Interpolation<Theme>;
  // 容器包裹的子元素
  children?: ReactNode;
  // 设计尺寸（设计稿宽度），默认 750
  designWidth?: number;
  // 视口最大宽度（px），默认 750；超出后 fontSize 锁定、body 居中
  // 保证 H5 页面在 PC 端打开时 rem 尺寸不会被大视口放大，呈现与手机一致的布局
  // 如需全隐制高度（复价响应式）传入 0 或 Infinity 即可
  maxWidth?: number;
}

const isBrowser = typeof window !== "undefined";
// SSR 时 useLayoutEffect 会 warn，统一降级
const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

// 取当前视口宽度，可选 maxWidth 兑底（0 / Infinity 表示不限制）
function getViewportWidth(maxWidth?: number): number {
  if (!isBrowser) return 0;
  const w = window.innerWidth || document.documentElement.clientWidth || 0;
  if (!maxWidth || !isFinite(maxWidth)) return w;
  return Math.min(w, maxWidth);
}

/**
 * 自适应容器：所有使用本库的工程都需在根节点放置该组件，
 * 否则各组件中的 rem 单位将无法自动跟随设备宽度缩放。
 *
 * 实现要点：
 *  - <Global> 通过 useInsertionEffect 早于 useLayoutEffect 注入样式，
 *    所以首次 layout 阶段所有 rem 已使用正确 fontSize，无需阻塞 children
 *  - 浏览器字体缩放（用户系统调大字号）首挂载同步检测一次，scaleFactor 修正
 *  - resize 走 rAF 节流，桌面拖拽 / 模拟器切设备不会反复 setState
 *  - SSR 安全：所有 window 访问加 isBrowser 守卫
 */
export function Container(props: ContainerProps) {
  const { designWidth = 750, maxWidth = 750, globalStyle, children } = props;

  // 当前视口宽度
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    getViewportWidth(maxWidth),
  );

  // 浏览器字体缩放因子（>1 用户放大系统字体），首挂载探测一次
  const [scaleFactor, setScaleFactor] = useState(1);

  // 理论 fontSize（未修正）
  const rawFontSize = useMemo(
    () => (viewportWidth * 100) / designWidth,
    [viewportWidth, designWidth],
  );

  // 最终 fontSize：缩放修正 + 1 位小数，避免浮点抖动
  const fontSize = useMemo(
    () =>
      Math.round(
        (scaleFactor === 1 ? rawFontSize : rawFontSize / scaleFactor) * 10,
      ) / 10,
    [rawFontSize, scaleFactor],
  );

  // 浏览器字体缩放检测：仅首挂载执行一次，避免 setState 触发循环
  const detectedRef = useRef(false);
  useIsomorphicLayoutEffect(() => {
    if (detectedRef.current || !isBrowser) return;
    detectedRef.current = true;
    const computed = parseFloat(
      window.getComputedStyle(document.documentElement).fontSize,
    );
    // 容差 1px 屏蔽浮点误差
    if (computed > 0 && Math.abs(computed - rawFontSize) > 1) {
      setScaleFactor(computed / rawFontSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // maxWidth 变更时重算 viewportWidth
  useEffect(() => {
    setViewportWidth((prev) => {
      const next = getViewportWidth(maxWidth);
      return prev === next ? prev : next;
    });
  }, [maxWidth]);

  // resize：rAF 节流；桌面拖动窗口、DevTools 切换设备模拟时也只每帧一次
  const rafRef = useRef<number | null>(null);
  useWindowResize(() => {
    if (!isBrowser || rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const next = getViewportWidth(maxWidth);
      setViewportWidth((prev) => (prev === next ? prev : next));
    });
  });

  // 组件卸载清理 pending rAF
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  // viewport meta
  useViewport();

  // 激活 iOS 上的 :active 伪类
  useEffect(() => {
    if (!isBrowser) return;
    const noop = () => {};
    document.body.addEventListener("touchstart", noop, { passive: true });
    return () => {
      document.body.removeEventListener("touchstart", noop);
    };
  }, []);

  // --clxx-px：库内组件统一基于 750 设计稿做尺寸（用 utils/rem.ts 的 r() helper），
  // 与用户的 designWidth 完全解耦。否则用户传 designWidth=375 时，库内写死的
  // ".28rem"（按 750 设计稿出）会被 html fontSize 放大一倍，导致整个库视觉错位。
  //
  // 计算口径：1 个「750 设计稿 px」在当前视口下应该渲染成多少 css px：
  //   --clxx-px = clamp(viewport, maxWidth) / 750
  //   视口 750  → 1
  //   视口 375  → 0.5
  //   视口 1080 → 1.44
  // r(28) = calc(28 * var(--clxx-px)) = 视口比例下的 28 设计稿 px。
  const LIB_DESIGN_WIDTH = 750;
  const clxxPx = useMemo(() => {
    // 字号缩放修正同样要应用：浏览器把 html 字号放大 N 倍时，rem 字面量会跟着放大；
    // --clxx-px 也必须 / scaleFactor 才能保持库内尺寸的稳定。
    const raw = viewportWidth / LIB_DESIGN_WIDTH;
    const fixed = scaleFactor === 1 ? raw : raw / scaleFactor;
    // 4 位小数已远超 1 设备 px 精度，避免浮点串导致 css 变量频繁字符串变化
    return Math.round(fixed * 10000) / 10000;
  }, [viewportWidth, scaleFactor]);

  // 全局样式：fontSize 写入 html，rem 自动跟随
  // body 以 maxWidth 居中，保证 PC 端上页面不超过设计宽度，两侧留白
  // CSS 变量 --clxx-max-width 供 Overlay/Fixed 等使用 fixed 定位的组件读取
  // 从而把弹窗 / 遮罩限制在视口内（fixed 默认参考浏览器窗口，无法继承 body 宽度）
  const hasMaxWidth = !!maxWidth && isFinite(maxWidth);
  const globalStyles = useMemo<Interpolation<Theme>>(
    () => [
      {
        ":root": {
          "--clxx-max-width": hasMaxWidth ? `${maxWidth}px` : "100%",
          "--clxx-px": `${clxxPx}px`,
        },
        "*": {
          boxSizing: "border-box" as const,
        },
        html: {
          WebkitTapHighlightColor: "transparent",
          WebkitOverflowScrolling: "touch",
          WebkitTextSizeAdjust: "100%",
          fontSize: `${fontSize}px`,
          touchAction: "manipulation",
        },
        body: {
          fontSize: "16px",
          margin: "0 auto",
          ...(hasMaxWidth ? { maxWidth: `${maxWidth}px` } : null),
        },
      },
      globalStyle,
    ],
    [fontSize, maxWidth, hasMaxWidth, clxxPx, globalStyle],
  );

  return (
    <Fragment>
      <Global styles={globalStyles} />
      {children}
    </Fragment>
  );
}

