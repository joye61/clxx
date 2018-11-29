"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cookie = _interopRequireDefault(require("./cookie"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 简单检测逻辑
 */
var is = {
  android: false,
  ios: false,
  weixin: false,
  qq: false,
  chelun: false,
  chelunLogin: false
};
var _default = is;
exports.default = _default;
var ua = window.navigator.userAgent;

if (/iPhone|iPad/i.test(ua)) {
  is.ios = true;
}

if (/Android/i.test(ua)) {
  is.android = true;
}

if (/MicroMessenger/i.test(ua)) {
  is.weixin = true;
}

if (/QQ/i.test(ua)) {
  is.qq = true;
} // 车轮域名下检测逻辑


if (/chelun\.com|eclick\.cn/.test(window.location.host)) {
  var cookies = _cookie.default.all();

  if (cookies["chelun_appName"]) {
    is.chelun = true;
  }

  var isLogin = cookies["chelun_isLogin"];

  if (!isLogin) {
    isLogin = "false";
  }

  is.chelunLogin = isLogin === "false" ? false : true;
}