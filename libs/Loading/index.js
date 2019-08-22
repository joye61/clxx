"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/** @jsx jsx */
var core_1 = require("@emotion/core");
var react_1 = __importDefault(require("react"));
var react_dom_1 = __importDefault(require("react-dom"));
var WaveLoading_1 = require("./WaveLoading");
var HelixLoading_1 = require("./HelixLoading");
var style_1 = require("./style");
var Loading = /** @class */ (function () {
    function Loading(option) {
        this.container = document.createElement("div");
        // 默认配置
        var config = {
            type: "wave",
            color: "#fff"
        };
        if (typeof option === "string") {
            config.hint = option;
        }
        if (typeof option === "object") {
            config = __assign({}, config, option);
        }
        // 默认Loading样式是转菊花
        var Component = null;
        var type = config.type.toLowerCase();
        if (type === "wave") {
            Component = WaveLoading_1.WaveLoading;
        }
        else if (type === "helix") {
            Component = HelixLoading_1.HelixLoading;
        }
        else {
            throw new Error("Invalid loading type '" + config.type + "'");
        }
        // 支持组件hint
        var hintComponent = null;
        if (react_1.default.isValidElement(config.hint)) {
            hintComponent = config.hint;
        }
        else {
            hintComponent = config.hint ? (core_1.jsx("p", { css: style_1.style.hint("#fff") }, config.hint)) : null;
        }
        document.body.appendChild(this.container);
        react_dom_1.default.render(core_1.jsx("div", { css: style_1.style.mask },
            core_1.jsx("div", { css: style_1.style.container },
                core_1.jsx(Component, { color: config.color }),
                hintComponent)), this.container);
    }
    Loading.prototype.destroy = function () {
        react_dom_1.default.unmountComponentAtNode(this.container);
        this.container.remove();
    };
    return Loading;
}());
exports.Loading = Loading;
