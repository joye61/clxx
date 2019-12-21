/** @jsx jsx */
import { jsx, SerializedStyles, InterpolationWithTheme } from "@emotion/core";
import { FixContainer } from "@clxx/layout";
import { style, containerHide } from "./style";

export type DialogType = "dialog" | "pullup";

export interface DialogWrapperProps {
  type?: DialogType;
  children?: React.ReactNode;
  animation?: "show" | "hide";
  onHide?: () => void;
}

export function DialogWrapper(props: DialogWrapperProps) {
  const { type = "dialog", animation = "show", children } = props;
  let containerAnimation: SerializedStyles;
  let boxAnimation: SerializedStyles;
  if (animation === "show") {
    containerAnimation = style.containerShow;
    switch (type) {
      case "dialog":
        boxAnimation = style.dialogShow;
        break;
      case "pullup":
        boxAnimation = style.pullupShow;
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
      case "pullup":
        boxAnimation = style.pullupHide;
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
      props.onHide?.();
    }
  };

  const boxCss: InterpolationWithTheme<any> = [];
  if (type === "pullup") {
    boxCss.push(style.pullUp);
  }
  boxCss.push(boxAnimation, style.duration);

  return (
    <FixContainer
      centerChild={type === "dialog"}
      css={[containerAnimation, style.duration]}
      onAnimationEnd={animationEnd}
    >
      <div css={boxCss}>{children}</div>
    </FixContainer>
  );
}
