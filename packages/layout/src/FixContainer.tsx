/** @jsx jsx */
import { jsx, ObjectInterpolation } from "@emotion/core";

export interface FixContainerProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  /**
   * 是否显示半透明背景
   */
  showMask?: boolean;
  /**
   * 是否让子元素垂直和水平都居中
   */
  centerChild?: boolean;
  /**
   * 容器内容
   */
  children?: React.ReactNode;
}

/**
 * fix定位的容器元素，一般作为弹框的背景
 * @param props
 */
export function FixContainer(props: FixContainerProps) {
  const {
    showMask = true,
    centerChild = true,
    children,
    ...attributes
  } = props;
  const styles: ObjectInterpolation<any> = {
    position: "fixed",
    left: "50%",
    zIndex: 9,
    width: "100%",
    maxWidth: "576px",
    transform: `translateX(-50%)`,
    height: "100%",
    top: 0
  };
  if (showMask) {
    styles.backgroundColor = `rgba(0,0,0,.6)`;
  }
  if (centerChild) {
    styles.display = "flex";
    styles.justifyContent = "center";
    styles.alignItems = "center";
  }
  return (
    <div css={styles} {...attributes}>
      {children}
    </div>
  );
}
