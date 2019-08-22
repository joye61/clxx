"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @jsx jsx */
var core_1 = require("@emotion/core");
var WaveStyle_1 = require("./WaveStyle");
/**
 * 波浪形Loading
 * @param {*} color 颜色
 */
function WaveLoading(_a) {
    var _b = _a.color, color = _b === void 0 ? "#000" : _b;
    var list = [];
    for (var i = 0; i < WaveStyle_1.barNum; i++) {
        list.push(core_1.jsx("span", { key: i, css: [WaveStyle_1.style.item(color), WaveStyle_1.style["bar-" + i]] }));
    }
    return core_1.jsx("div", { css: WaveStyle_1.style.container }, list);
}
exports.WaveLoading = WaveLoading;
