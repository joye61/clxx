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
var ToastComponent_1 = require("./ToastComponent");
var Toast = /** @class */ (function () {
    function Toast(option) {
        var _this = this;
        this.container = document.createElement("div");
        var config = {
            duration: 3000,
            position: "middle" // 位置 top|middle|center
        };
        if (typeof option === "string") {
            config.content = option;
        }
        if (typeof option === "object") {
            config = __assign({}, config, option);
        }
        var className = "cl-Toast-container";
        if (config.position === "top") {
            className += " cl-Toast-container-top";
        }
        else if (config.position === "bottom") {
            className += " cl-Toast-container-bottom";
        }
        else {
            className += " cl-Toast-container-middle";
        }
        document.body.appendChild(this.container);
        react_dom_1.default.render(react_1.default.createElement("div", { className: className },
            react_1.default.createElement(ToastComponent_1.ToastComponent, { content: config.content, duration: config.duration, onEnd: function () {
                    // 这里是完全结束，需要清理
                    react_dom_1.default.unmountComponentAtNode(_this.container);
                    _this.container.remove();
                } })), this.container);
    }
    return Toast;
}());
exports.default = Toast;
