import React, { useEffect, useRef } from "react";
import { Activable } from "./Activable";
export function Clickable(props) {
    const targetRef = useRef();
    // 一旦挂载成功，立即绑定相应事件处理逻辑
    useEffect(() => {
        const actor = new Activable({
            target: targetRef.current,
            activeClass: props.activeClass,
            activeStyle: props.activeStyle,
            bubblable: props.bubblable,
            onClick: props.onClick
        });
        return () => actor.destroy();
    });
    let containerProps = {
        className: props.className,
        id: props.id,
        style: props.style
    };
    return (React.createElement("div", Object.assign({}, containerProps, { ref: targetRef }), props.children));
}
