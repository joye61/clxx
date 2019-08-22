"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@emotion/core");
var cssUtil_1 = require("../cssUtil");
exports.showAnimation = core_1.keyframes(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  from {\n    opacity: 0;\n    transform: translate3d(-50%, ", ", 0);\n  }\n  to {\n    opacity: 1;\n    transform: translate3d(-50%, 0, 0);\n  }\n"], ["\n  from {\n    opacity: 0;\n    transform: translate3d(-50%, ", ", 0);\n  }\n  to {\n    opacity: 1;\n    transform: translate3d(-50%, 0, 0);\n  }\n"])), cssUtil_1.vw(10));
exports.hideAnimation = core_1.keyframes(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  from {\n    opacity: 1;\n    transform: translate3d(-50%, 0, 0);\n  }\n  to {\n    opacity: 0;\n    transform: translate3d(-50%, ", ", 0);\n  }\n"], ["\n  from {\n    opacity: 1;\n    transform: translate3d(-50%, 0, 0);\n  }\n  to {\n    opacity: 0;\n    transform: translate3d(-50%, ", ", 0);\n  }\n"])), cssUtil_1.vw(-10));
exports.style = {
    container: core_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    position: fixed;\n    max-width: ", ";\n    left: 50%;\n    transform: translate3d(-50%, 0, 0);\n    z-index: 9999;\n  "], ["\n    position: fixed;\n    max-width: ", ";\n    left: 50%;\n    transform: translate3d(-50%, 0, 0);\n    z-index: 9999;\n  "])), cssUtil_1.vw(375 * 0.8)),
    containerShow: core_1.css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    animation: ", " 0.2s ease-in;\n  "], ["\n    animation: ", " 0.2s ease-in;\n  "])), exports.showAnimation),
    containerHide: core_1.css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n    animation: ", " 0.2s ease-out;\n  "], ["\n    animation: ", " 0.2s ease-out;\n  "])), exports.hideAnimation),
    top: core_1.css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n    top: ", ";\n  "], ["\n    top: ", ";\n  "])), cssUtil_1.vw(30)),
    middle: core_1.css(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n    top: 50%;\n    transform: translate3d(-50%, -50%, 0) scale(1);\n  "], ["\n    top: 50%;\n    transform: translate3d(-50%, -50%, 0) scale(1);\n  "]))),
    bottom: core_1.css(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n    bottom: ", ";\n  "], ["\n    bottom: ", ";\n  "])), cssUtil_1.vw(30)),
    content: core_1.css(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n    background-color: rgba(50, 50, 50, 0.9);\n    font-size: ", ";\n    color: #fff;\n    margin: 0;\n    line-height: ", ";\n    padding: 0 ", ";\n  "], ["\n    background-color: rgba(50, 50, 50, 0.9);\n    font-size: ", ";\n    color: #fff;\n    margin: 0;\n    line-height: ", ";\n    padding: 0 ", ";\n  "])), cssUtil_1.vw(12), cssUtil_1.vw(30), cssUtil_1.vw(10))
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
