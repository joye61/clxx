"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@emotion/core");
var cssUtil_1 = require("../cssUtil");
exports.style = {
    mask: core_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    z-index: 9999;\n  "], ["\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    z-index: 9999;\n  "]))),
    container: core_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    background-color: rgba(0, 0, 0, 0.8);\n    width: ", ";\n    height: ", ";\n    border-radius: ", ";\n    @media screen and (min-width: 576px) {\n      width: 90px;\n      height: 90px;\n      border-radius: 10px;\n    }\n  "], ["\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    background-color: rgba(0, 0, 0, 0.8);\n    width: ", ";\n    height: ", ";\n    border-radius: ", ";\n    @media screen and (min-width: 576px) {\n      width: 90px;\n      height: 90px;\n      border-radius: 10px;\n    }\n  "])), cssUtil_1.vw(90), cssUtil_1.vw(90), cssUtil_1.vw(10)),
    hint: function (hintColor) {
        return core_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      color: ", ";\n      padding: 0;\n      margin: 0;\n      font-size: ", ";\n      margin-top: ", ";\n      @media screen and (min-width: 576px) {\n        font-size: 12px;\n        margin-top: 10px;\n      }\n    "], ["\n      color: ", ";\n      padding: 0;\n      margin: 0;\n      font-size: ", ";\n      margin-top: ", ";\n      @media screen and (min-width: 576px) {\n        font-size: 12px;\n        margin-top: 10px;\n      }\n    "])), hintColor, cssUtil_1.vw(12), cssUtil_1.vw(10));
    }
};
var templateObject_1, templateObject_2, templateObject_3;
