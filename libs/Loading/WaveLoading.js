"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
/**
 * 波浪形Loading
 * @param {*} color 颜色
 */
function WaveLoading(_a) {
    var _b = _a.color, color = _b === void 0 ? "#000" : _b;
    var list = [];
    for (var i = 0; i < 6; i++) {
        list.push(react_1.default.createElement("span", { className: "cl-Loading-wave-item", key: i, style: { backgroundColor: color } }));
    }
    return react_1.default.createElement("div", { className: "cl-Loading-wave-container" }, list);
}
exports.WaveLoading = WaveLoading;
