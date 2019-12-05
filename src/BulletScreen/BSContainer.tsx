/** @jsx jsx */
import { jsx, ObjectInterpolation, ArrayInterpolation } from "@emotion/core";
import { WidthProperty, HeightProperty } from "csstype";
import React from "react";

export interface BSContainerProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  width?: WidthProperty<number>;
  height?: HeightProperty<number>;
  children?: React.ReactNode;
  /**
   * 弹幕容器的样式，默认是覆盖整个父元素
   */
  bsOption?: ObjectInterpolation<any>;
}

export const BSContainer = React.forwardRef<HTMLDivElement, BSContainerProps>(
  (props, ref) => {
    let { width, height, children, bsOption, ...attributes } = props;

    /**
     * 容器的必须样式
     */
    const containerStyle: ObjectInterpolation<any> = {
      position: "relative",
      width,
      height
    };

    /**
     * 弹幕的必须样式
     */
    const bsStyle: ArrayInterpolation<any> = [
      {
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%"
      },
      bsOption
    ];

    return (
      <div css={containerStyle} {...attributes}>
        {children}
        <div css={bsStyle} ref={ref}></div>
      </div>
    );
  }
);
