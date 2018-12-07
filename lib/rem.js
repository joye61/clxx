"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rem;

var _isPlainObject = _interopRequireDefault(require("lodash/isPlainObject"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function rem(option) {
  var dw = document.documentElement.dataset.dw;
  var config = {
    criticalWidth: 576,
    designWidth: dw ? parseInt(dw) : 750
  };

  if (typeof option === "number") {
    config.designWidth = option;
  }

  if ((0, _isPlainObject.default)(option)) {
    config = _objectSpread({}, config, option);
  }

  var reset = function reset() {
    var fontSize = window.innerWidth <= config.criticalWidth ? "".concat(window.innerWidth * 100 / config.designWidth, "px") : "".concat(config.criticalWidth * 100 / config.designWidth, "px");
    document.documentElement.style.fontSize = fontSize;
  };

  window.onresize = reset;

  if (window.onorientationchange !== undefined) {
    window.onorientationchange = reset;
  }

  reset();
}