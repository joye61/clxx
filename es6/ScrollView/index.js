import React, { useRef, useEffect } from "react";
import { ScrollBinder } from "./ScrollBinder";
import { is } from "../is";
export function ScrollView(props) {
    const id = is.undefined(props.id) ? undefined : props.id;
    const className = is.undefined(props.className) ? undefined : props.className;
    const style = is.undefined(props.style) ? undefined : props.style;
    const container = useRef(null);
    useEffect(() => {
        let binder = new ScrollBinder(Object.assign(Object.assign({}, props), { target: container.current }));
        return () => {
            binder = null;
        };
    });
    return (React.createElement("div", { ref: container, id: id, className: className, style: style },
        React.createElement("div", null, props.children)));
}
