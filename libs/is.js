"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UA = window.navigator.userAgent;
exports.is = {
    android: /Android/i.test(UA),
    ios: /iPhone|iPad/i.test(UA),
    weixin: /MicroMessenger/i.test(UA),
    qq: /QQ/i.test(UA),
    iphoneX: /iPhone/gi.test(UA) && window.screen.height >= 812
};
