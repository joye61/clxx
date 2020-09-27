/** @jsx jsx */
import { jsx, SerializedStyles, InterpolationWithTheme } from "@emotion/core";
import { FixContainer, FixContainerProps } from "../Layout/FixContainer";
import { style, containerHide } from "./style";

export type DialogType =
  | "dialog"
  | "pullUp"
  | "pullDown"
  | "pullLeft"
  | "pullRight";
export type AnimationStatus = "show" | "hide";

export interface WrapperProps {
  // 对话框类型
  type?: DialogType;
  // 对话框容器的内容
  children?: React.ReactNode;
  // 对话框打开或者关闭的动画状态
  animationStatus?: AnimationStatus;
  // 对话框完全关闭时触发的回调
  onHide?: () => void;
  // 对话框打开或者关闭时动画的时长
  animationDuration?: number | string;
  // FixContainer 容器选项
  maskOption?: FixContainerProps;
  // 容器被点击时触发
  onMaskClick?: () => void;
  // 容器的样式
  boxStyle?: SerializedStyles;
}

export function Wrapper(props: WrapperProps) {
  const {
    type = "dialog",
    animationStatus = "show",
    animationDuration = 200,
    children,
    onHide,
    maskOption,
    boxStyle,
    onMaskClick,
  } = props;
  let containerAnimation: SerializedStyles;
  let boxAnimation: SerializedStyles;
  if (animationStatus === "show") {
    containerAnimation = style.containerShow;
    switch (type) {
      case "dialog":
        boxAnimation = style.dialogShow;
        break;
      case "pullUp":
        boxAnimation = style.pullUpShow;
        break;
      case "pullDown":
        boxAnimation = style.pullDownShow;
        break;
      case "pullLeft":
        boxAnimation = style.pullLeftShow;
        break;
      case "pullRight":
        boxAnimation = style.pullRightShow;
        break;
      default:
        boxAnimation = style.dialogShow;
        break;
    }
  } else {
    containerAnimation = style.containerHide;
    switch (type) {
      case "dialog":
        boxAnimation = style.dialogHide;
        break;
      case "pullUp":
        boxAnimation = style.pullUpHide;
        break;
      case "pullDown":
        boxAnimation = style.pullDownHide;
        break;
      case "pullLeft":
        boxAnimation = style.pullLeftHide;
        break;
      case "pullRight":
        boxAnimation = style.pullRightHide;
        break;
      default:
        boxAnimation = style.dialogHide;
        break;
    }
  }

  /**
   * 完全关闭动画结束之后会触发
   * @param event
   */
  const animationEnd = (event: React.AnimationEvent) => {
    if (event.animationName === containerHide.name) {
      onHide?.();
    }
  };

  // 选取特定的
  const boxCss: InterpolationWithTheme<any> = [];
  switch (type) {
    case "pullUp":
      boxCss.push(style.pullUp);
      break;
    case "pullDown":
      boxCss.push(style.pullDown);
      break;
    case "pullLeft":
      boxCss.push(style.pullLeft);
      break;
    case "pullRight":
      boxCss.push(style.pullRight);
      break;
    default:
  }

  // 弹框动画函数和持续时长
  const duration = style.duration(animationDuration);
  boxCss.push(boxAnimation, duration);

  // 默认容器属性
  let fcOption: FixContainerProps = {};
  if (type === "dialog") {
    fcOption.centerChild = true;
  } else {
    fcOption.showMask = false;
  }

  // 覆盖默认属性
  fcOption = maskOption ? { ...fcOption, ...maskOption } : fcOption;

  return (
    <FixContainer
      centerChild={type === "dialog"}
      css={[containerAnimation, duration]}
      onAnimationEnd={animationEnd}
      onClick={(event) => {
        event.stopPropagation();
        // 当点击对象是背景对象本身时触发
        if(event.target === event.currentTarget) {
          onMaskClick?.();
        }
      }}
      {...fcOption}
    >
      <div css={[boxCss, boxStyle]}>{children}</div>
    </FixContainer>
  );
}
