import React from "react";
import ReactDOM from "react-dom";
import { is } from "../is";
import { Alert as AlertComponent } from "./Alert";
/**
 * 弹框提示
 * @param option
 */
export function Alert(option) {
    let props;
    if (is.plainObject(option) && option.content) {
        props = option;
    }
    else {
        props = {
            content: option
        };
    }
    const container = document.createElement("div");
    document.body.appendChild(container);
    props.onHide = () => {
        ReactDOM.unmountComponentAtNode(container);
        container.remove();
    };
    ReactDOM.render(React.createElement(AlertComponent, Object.assign({}, props)), container);
}
