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
var AlertComponent_1 = require("./AlertComponent");
/**
 *
 * @param option
 */
function Alert(option) {
    var props;
    if (typeof option === "string") {
        props = {
            content: option
        };
    }
    else if (typeof option === "object") {
        props = option;
    }
    else {
        throw new Error("无效的参数");
    }
    var container = document.createElement("div");
    document.body.appendChild(container);
    props.onHide = function () {
        react_dom_1.default.unmountComponentAtNode(container);
        container.remove();
    };
    react_dom_1.default.render(react_1.default.createElement(AlertComponent_1.AlertComponent, __assign({}, props)), container);
}
exports.Alert = Alert;
