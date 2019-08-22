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
var isPlainObject_1 = __importDefault(require("lodash/isPlainObject"));
exports.Toast = {
    container: null,
    create: function (option) {
        var _this = this;
        if (this.container === null) {
            this.container = document.createElement("div");
            document.body.appendChild(this.container);
        }
        else {
            react_dom_1.default.unmountComponentAtNode(this.container);
        }
        var props;
        if (isPlainObject_1.default(option)) {
            props = option;
        }
        else {
            props = {
                content: option
            };
        }
        props.onEnd = function () {
            if (_this.container instanceof HTMLElement) {
                react_dom_1.default.unmountComponentAtNode(_this.container);
                _this.container.remove();
            }
        };
        react_dom_1.default.render(react_1.default.createElement(ToastComponent_1.ToastComponent, __assign({}, props)), this.container);
    }
};
