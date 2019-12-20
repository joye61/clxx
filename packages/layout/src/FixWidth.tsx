/** @jsx jsx */
import { jsx } from "@emotion/core";
import { TopProperty, BottomProperty } from "csstype";

export interface FixWidthProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  top?: TopProperty<number>;
  bottom?: BottomProperty<number>;
  children?: React.ReactNode;
}

export function FixWidth(props: FixWidthProps) {
  const { top, bottom, children, ...attributes } = props;
  return (
    <div
      css={{
        position: "fixed",
        left: "50%",
        zIndex: 9,
        width: "100%",
        maxWidth: "576px",
        transform: `translateX(-50%)`,
        top,
        bottom
      }}
      {...attributes}
    >
      {children}
    </div>
  );
}
