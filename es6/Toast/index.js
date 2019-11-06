import React from "react";
import ReactDOM from "react-dom";
import { Toast as ToastComponent } from "./Toast";
import { is } from "../is";
export const Toast = {
    container: null,
    create(option) {
        if (this.container === null) {
            this.container = document.createElement("div");
            document.body.appendChild(this.container);
        }
        else {
            ReactDOM.unmountComponentAtNode(this.container);
        }
        let props;
        if (is.plainObject(option) && option.content) {
            props = option;
        }
        else {
            props = {
                content: option
            };
        }
        props.onEnd = () => {
            if (this.container instanceof HTMLElement) {
                ReactDOM.unmountComponentAtNode(this.container);
                this.container.remove();
                this.container = null;
            }
        };
        ReactDOM.render(React.createElement(ToastComponent, Object.assign({}, props)), this.container);
    }
};
