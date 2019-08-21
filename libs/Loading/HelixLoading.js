"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
/**
 * 菊花齿轮形Loading
 * @param {*} color 颜色
 */
function HelixLoading(_a) {
    var _b = _a.color, color = _b === void 0 ? "#fff" : _b;
    var list = [];
    for (var i = 0; i < 12; i++) {
        list.push(react_1.default.createElement("div", { className: "cl-Loading-helix-item", key: i },
            react_1.default.createElement("span", { className: "cl-Loading-helix-itembar", style: { backgroundColor: color } })));
    }
    return react_1.default.createElement("div", { className: "cl-Loading-helix-container" }, list);
}
exports.HelixLoading = HelixLoading;
