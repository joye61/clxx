/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import ReactDOM from "react-dom";
import { WaveLoading } from "./WaveLoading";
import { HelixLoading } from "./HelixLoading";
import { style } from "./style";
export class Loading {
    constructor(option) {
        this.container = document.createElement("div");
        // 默认配置
        let config = {
            type: "wave",
            color: "#fff"
        };
        if (typeof option === "object" && option.type) {
            config = Object.assign(Object.assign({}, config), option);
        }
        else {
            config.hint = option;
        }
        // 默认Loading样式是转菊花
        let Component = null;
        let type = config.type.toLowerCase();
        if (type === "wave") {
            Component = WaveLoading;
        }
        else if (type === "helix") {
            Component = HelixLoading;
        }
        else {
            throw new Error(`Invalid loading type '${config.type}'`);
        }
        // 支持组件hint
        let hintComponent = null;
        if (React.isValidElement(config.hint)) {
            hintComponent = config.hint;
        }
        else {
            hintComponent = config.hint ? (jsx("p", { css: style.hint("#fff") }, config.hint)) : null;
        }
        document.body.appendChild(this.container);
        ReactDOM.render(jsx("div", { css: style.mask },
            jsx("div", { css: style.container },
                jsx(Component, { color: config.color }),
                hintComponent)), this.container);
    }
    destroy() {
        ReactDOM.unmountComponentAtNode(this.container);
        this.container.remove();
    }
}
