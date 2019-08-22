"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@emotion/core");
var cssUtil_1 = require("../cssUtil");
exports.barNum = 6;
exports.wave = core_1.keyframes(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n0%, 40%, 100% {\n  transform: scaleY(1);\n  opacity: .3;\n}\n\n20% {\n    transform: scaleY(1.8);\n    opacity: 1;\n}\n"], ["\n0%, 40%, 100% {\n  transform: scaleY(1);\n  opacity: .3;\n}\n\n20% {\n    transform: scaleY(1.8);\n    opacity: 1;\n}\n"])));
var duration = 800;
exports.style = {
    container: core_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    font-size: 0;\n  "], ["\n    font-size: 0;\n  "]))),
    item: function (barColor) {
        if (barColor === void 0) { barColor = "#000"; }
        return core_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      display: inline-block;\n      width: ", ";\n      height: ", ";\n      margin-right: ", ";\n      @media screen and (min-width: 576px) {\n        width: 2px;\n        height: 14px;\n        margin-right: 4px;\n      }\n      background-color: ", ";\n      animation: ", " ", "ms ease-in-out infinite;\n    "], ["\n      display: inline-block;\n      width: ", ";\n      height: ", ";\n      margin-right: ", ";\n      @media screen and (min-width: 576px) {\n        width: 2px;\n        height: 14px;\n        margin-right: 4px;\n      }\n      background-color: ", ";\n      animation: ", " ", "ms ease-in-out infinite;\n    "])), cssUtil_1.vw(2), cssUtil_1.vw(14), cssUtil_1.vw(4), barColor, exports.wave, duration);
    }
};
for (var i = 0; i < exports.barNum; i++) {
    exports.style["bar-" + i] = core_1.css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    animation-delay: ", "ms;\n  "], ["\n    animation-delay: ", "ms;\n  "])), i * 100 - duration);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
