/** @jsx jsx */
import { jsx, Theme, Interpolation, ArrayInterpolation } from "@emotion/react";
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

  // 选取特定的类型对应的样式
  let boxCss: ArrayInterpolation<Theme> = [style.boxCss];
  if (["pullUp", "pullDown", "pullLeft", "pullRight"].includes(type)) {
    boxCss.push(style[type as keyof typeof style]);
  }

  // 遮罩的样式
  let maskCss: ArrayInterpolation<Theme> = [
    style.mask,
    status === "show" ? style.maskShow : style.maskHide,
    maskStyle,
  ];
  // 遮罩颜色
  if (maskColor) {
    maskCss.push({ backgroundColor: maskColor });
  }

  // 空白处点击
  const blankClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      event.stopPropagation();
      onBlankClick?.(event);
    }
  };

  return (
    <Overlay
      css={{ overflow: "hidden" }}
      centerContent={type === "center"}
      maskColor="transparent"
      fullScreen
      onClick={showMask ? undefined : blankClick}
    >
      {showMask && <div css={maskCss} onClick={blankClick} />}
      <div
        css={[boxCss, boxStyle, animation]}
        onAnimationEnd={(event) => {
          if (status === "hide" && event.animationName === keyframes.name) {
            onHide?.();
          }
        }}
      >
        {children}
      </div>
    </Overlay>
  );
}
