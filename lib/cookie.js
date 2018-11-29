"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var cookie = {
  all: function all() {
    var maps = {};
    var cookArr = document.cookie.split(";");

    for (var i in cookArr) {
      var tmp = cookArr[i].replace(/^\s*/, "");

      if (tmp) {
        var nv = tmp.split("=");
        maps[nv[0]] = nv[1] || "";
      }
    }

    return maps;
  },
  get: function get(name) {
    return this.all()[name];
  },
  set: function set(name, value, option) {
    var str = "".concat(name, "=").concat(value);
    option.path && (str += ";path=".concat(option.path));
    option.domain && (str += ";domain=".concat(option.domain));
    option.maxAge && (str += ";max-age=".concat(option.maxAge));
    option.expires && (str += ";expires=".concat(option.expires));
    option.httpOnly && (str += ";secure");
    document.cookie = str;
  }
};
var _default = cookie;
exports.default = _default;