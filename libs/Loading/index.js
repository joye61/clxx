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
var react_1 = __importDefault(require("react"));
var react_dom_1 = __importDefault(require("react-dom"));
var WaveLoading_1 = require("./WaveLoading");
var HelixLoading_1 = require("./HelixLoading");
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
        var hintComponent = null;
        if (typeof config.hint === "string") {
            hintComponent = (react_1.default.createElement("p", { className: "cl-Loading-hint", style: { color: "#fff" } }, config.hint));
        }
        if (react_1.default.isValidElement(config.hint)) {
            hintComponent = config.hint;
        }
        document.body.appendChild(this.container);
        react_dom_1.default.render(react_1.default.createElement("div", { className: "cl-Loading-mask" },
            react_1.default.createElement("div", { className: "cl-Loading" },
                react_1.default.createElement(Component, { color: config.color }),
                hintComponent)), this.container);
    }
    Loading.prototype.destroy = function () {
        react_dom_1.default.unmountComponentAtNode(this.container);
        this.container.remove();
    };
    return Loading;
}());
exports.Loading = Loading;
