import { useMemo } from "react";
import { Theme, Interpolation } from "@emotion/react";
import { Overlay } from "../Overlay";
import { style, DialogType, AnimationStatus, getAnimation } from "./style";

export interface WrapperProps {
  // 对话框类型
  type?: DialogType;
  // 对话框容器的内容
  children?: React.ReactNode;
  // 对话框打开或者关闭的动画状态
  status?: AnimationStatus;
  // 对话框完全关闭时触发的回调
  onHide?: () => void;
  // 是否显示遮罩
  showMask?: boolean;
  // 遮罩颜色
  maskColor?: string;
  // 容器被点击时触发
  onBlankClick?: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  // 容器的样式
  boxStyle?: Interpolation<Theme>;
  // 遮罩样式
  maskStyle?: Interpolation<Theme>;
}

// 常量：Overlay 顶层容器 css
const overlayCss = { overflow: "hidden" };

// 仅这几种类型需要附加位置样式；center 由 Overlay 的 centerContent 居中
const POSITIONED_TYPES = new Set<DialogType>([
  "pullUp",
  "pullDown",
  "pullLeft",
  "pullRight",
]);

export function Wrapper(props: WrapperProps) {
  const {
    type = "center",
    status = "show",
    children,
    onHide,
    showMask = true,
    maskColor,
    maskStyle,
    boxStyle,
    onBlankClick,
  } = props;
  const { animation, keyframes } = getAnimation(type, status);

  // 缓存：仅当 type 变化时重建
  const positionStyle = useMemo(
    () => (POSITIONED_TYPES.has(type) ? style[type as keyof typeof style] : null),
    [type],
  );

  // 缓存：仅当 status / 外部 maskStyle / maskColor 变化时重建
  const maskCss = useMemo(
    () => [
      style.mask,
      status === "show" ? style.maskShow : style.maskHide,
      maskStyle,
      maskColor ? { backgroundColor: maskColor } : null,
    ],
    [status, maskStyle, maskColor],
  );

  // 空白处点击：仅在事件 target 与 currentTarget 一致时触发，避免冒泡误关闭
  const blankClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      event.stopPropagation();
      onBlankClick?.(event);
    }
  };

  return (
    <Overlay
      css={overlayCss}
      centerContent={type === "center"}
      maskColor="transparent"
      fullScreen
      onClick={showMask ? undefined : blankClick}
    >
      {showMask && <div css={maskCss} onClick={blankClick} />}
      <div
        css={[style.boxCss, positionStyle, boxStyle, animation]}
        onAnimationEnd={(event) => {
          // 仅响应隐藏动画结束，且必须是 box 自身的动画（避免子元素同名动画事件冒泡误触发）
          if (
            status === "hide" &&
            event.target === event.currentTarget &&
            event.animationName === keyframes.name
          ) {
            onHide?.();
          }
        }}
      >
        {children}
      </div>
    </Overlay>
  );
}
