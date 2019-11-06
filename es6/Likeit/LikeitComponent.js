/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { useRef } from "react";
import { getStyleProps } from "../cssUtil";
import { Likeit } from ".";
import { is } from "../is";
/**
 * 默认包含容器为div块框，可以根据需要自行设置css
 * @param props
 */
export function LikeitComponent(props) {
    const containerRef = useRef(null);
    const styleProps = getStyleProps(props);
    const onEnd = is.function(props.onEffectEnd) ? props.onEffectEnd : () => { };
    return (jsx("div", Object.assign({ ref: containerRef, css: css({ display: "inline" }) }, styleProps, { onClick: () => {
            Likeit(containerRef.current, props.effect, onEnd);
        } }), props.children));
}
