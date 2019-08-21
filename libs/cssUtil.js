"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 只适用于移动端的vw自适应
 */
function vw(num) {
    return (100 * num) / 375 + "vw";
}
exports.vw = vw;
