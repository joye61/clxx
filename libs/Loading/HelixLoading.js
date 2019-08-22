"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @jsx jsx */
var core_1 = require("@emotion/core");
var HelixStyle_1 = require("./HelixStyle");
/**
 * 菊花齿轮形Loading
 * @param {*} color 颜色
 */
function HelixLoading(_a) {
    var _b = _a.color, color = _b === void 0 ? "#000" : _b;
    var list = [];
    for (var i = 0; i < HelixStyle_1.barNum; i++) {
        list.push(core_1.jsx("span", { css: HelixStyle_1.style["bar-" + i], key: i }));
    }
    return core_1.jsx("div", { css: HelixStyle_1.style.container(color) }, list);
}
exports.HelixLoading = HelixLoading;
