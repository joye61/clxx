/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { useRef } from "react";
import { DefaultStyleProps, getStyleProps } from "../cssUtil";
import { Likeit } from ".";
import { is } from "../is";

export interface LikeitOption extends DefaultStyleProps {
  children: React.ReactNode;
  effect?: React.ReactNode;
  onEffectEnd?: () => void;
}

/**
 * 默认包含容器为div块框，可以根据需要自行设置css
 * @param props
 */
export function LikeitComponent(props: LikeitOption) {
  const containerRef = useRef<HTMLDivElement>(null);
  const styleProps = getStyleProps(props);
  const onEnd = is.function(props.onEffectEnd) ? props.onEffectEnd : () => {};
  return (
    <div
      ref={containerRef}
      css={css({ display: "inline" })}
      {...styleProps}
      onClick={() => {
        Likeit(containerRef.current!, props.effect, onEnd);
      }}
    >
      {props.children}
    </div>
  );
}
