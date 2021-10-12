/** @jsx jsx */
import { jsx, SerializedStyles, Theme, Interpolation } from "@emotion/react";
import { Overlay, OverlayProps } from "../Overlay";
import {
  style,
  containerHide,
  DialogType,
  AnimationStatus,
  getAnimation,
} from "./style";

export interface WrapperProps {
  // 对话框类型
  type?: DialogType;
  // 对话框容器的内容
  children?: React.ReactNode;
  // 对话框打开或者关闭的动画状态
  status?: AnimationStatus;
  // 对话框完全关闭时触发的回调
  onHide?: () => void;
  // 遮罩颜色
  maskColor?: string;
  // 容器被点击时触发
  onMaskClick?: () => void;
  // 容器的样式
  boxStyle?: Interpolation<Theme>;
}

export function Wrapper(props: WrapperProps) {
  const {
    type = "center",
    status = "show",
    children,
    onHide,
    maskColor,
    boxStyle,
    onMaskClick,
  } = props;
  const { animation } = getAnimation(type, status);

  /**
   * 完全关闭动画结束之后会触发
   * @param event
   */
  const animationEnd = (event: React.AnimationEvent) => {
    if (event.animationName === containerHide.name) {
      onHide?.();
    }
  };

  // 选取特定的类型对应的样式
  let boxCss: SerializedStyles | undefined = undefined;
  if (["pullUp", "pullDown", "pullLeft", "pullRight"].includes(type)) {
    boxCss = style[type as keyof typeof style];
  }

  // 遮罩的选项
  let overlayOption: OverlayProps = {
    centerContent: type === "center",
    maskColor,
    fullScreen: true,
  };

  return (
    <Overlay
      css={status === "show" ? style.containerShow : style.containerHide}
      onAnimationEnd={animationEnd}
      onClick={(event) => {
        // 阻止冒泡
        event.stopPropagation();
        // 当点击对象是背景对象本身时触发
        if (event.target === event.currentTarget) {
          onMaskClick?.();
        }
      }}
      {...overlayOption}
    >
      <div css={[animation, boxCss, boxStyle]}>{children}</div>
    </Overlay>
  );
}
