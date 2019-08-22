"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@emotion/core");
var cssUtil_1 = require("../cssUtil");
exports.barNum = 12;
exports.rotate = core_1.keyframes(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\nfrom {\n  transform: rotate(0);\n}\nto {\n  transform: rotate(360deg);\n}\n"], ["\nfrom {\n  transform: rotate(0);\n}\nto {\n  transform: rotate(360deg);\n}\n"])));
exports.style = {
    container: function (barColor) {
        if (barColor === void 0) { barColor = "#000"; }
        return core_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      width: ", ";\n      height: ", ";\n      position: relative;\n      animation: ", " 800ms steps(", ") infinite;\n      span {\n        position: absolute;\n        top: 0;\n        height: 100%;\n        box-sizing: border-box;\n        width: ", ";\n        margin-left: ", ";\n        height: 100%;\n        left: 50%;\n        border-top: ", " solid ", ";\n      }\n\n      @media screen and (min-width: 576px) {\n        width: 30px;\n        height: 30px;\n        span {\n          width: 2px;\n          margin-left: -1px;\n          border-top: 8px solid ", ";\n        }\n      }\n    "], ["\n      width: ", ";\n      height: ", ";\n      position: relative;\n      animation: ", " 800ms steps(", ") infinite;\n      span {\n        position: absolute;\n        top: 0;\n        height: 100%;\n        box-sizing: border-box;\n        width: ", ";\n        margin-left: ", ";\n        height: 100%;\n        left: 50%;\n        border-top: ", " solid ", ";\n      }\n\n      @media screen and (min-width: 576px) {\n        width: 30px;\n        height: 30px;\n        span {\n          width: 2px;\n          margin-left: -1px;\n          border-top: 8px solid ", ";\n        }\n      }\n    "])), cssUtil_1.vw(30), cssUtil_1.vw(30), exports.rotate, exports.barNum, cssUtil_1.vw(2), cssUtil_1.vw(-1), cssUtil_1.vw(8), barColor, barColor);
    }
};
for (var i = 0; i < exports.barNum; i++) {
    exports.style["bar-" + i] = core_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    transform: rotate(", "deg);\n    opacity: ", ";\n  "], ["\n    transform: rotate(", "deg);\n    opacity: ", ";\n  "])), (360 * i) / exports.barNum, 1 - i / exports.barNum);
}
var templateObject_1, templateObject_2, templateObject_3;
