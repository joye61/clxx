import { css, Interpolation } from "@emotion/react";

export interface FixedProps extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export function Fixed(props: FixedProps) {
  const { children, position = "bottom", ...extra } = props;
  const styles: Interpolation = {
    position: "fixed",
  };
  if (position === "top") {
    styles.top = 0;
    styles.width = "100%";
    styles.left = 0;
  } else if (position === "bottom") {
    styles.bottom = 0;
    styles.width = "100%";
    styles.left = 0;
  } else if (position === "left") {
    styles.left = 0;
    styles.height = "100%";
  } else if (position === "right") {
    styles.right = 0;
    styles.height = "100%";
  }

  return (
    <div {...props} css={styles} {...extra}>
      {props.children}
    </div>
  );
}
