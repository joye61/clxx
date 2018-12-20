"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ScrollBar;

var _react = _interopRequireDefault(require("react"));

var _env = require("./env");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function ScrollBar(props) {
  var barStyle = {
    position: "absolute",
    background: props.background
  };

  if (props.direction === "vertical") {
    var _objectSpread2;

    barStyle = _objectSpread({}, barStyle, (_objectSpread2 = {}, _defineProperty(_objectSpread2, _env.reactTransformAttr, "translate3d(0, ".concat(props.offset, "px, 0)")), _defineProperty(_objectSpread2, "height", "".concat(props.longSide, "px")), _defineProperty(_objectSpread2, "top", 0), _defineProperty(_objectSpread2, "right", 0), _defineProperty(_objectSpread2, "width", "".concat(props.shortSide, "px")), _objectSpread2));
  }

  if (props.direction === "horizontal") {
    var _objectSpread3;

    barStyle = _objectSpread({}, barStyle, (_objectSpread3 = {}, _defineProperty(_objectSpread3, _env.reactTransformAttr, "translate3d(".concat(props.offset, "px, 0, 0)")), _defineProperty(_objectSpread3, "width", "".concat(props.longSide, "px")), _defineProperty(_objectSpread3, "left", 0), _defineProperty(_objectSpread3, "bottom", 0), _defineProperty(_objectSpread3, "height", "".concat(props.shortSide, "px")), _objectSpread3));
  }

  return _react.default.createElement("div", {
    className: "cl-ScrollView-bar",
    style: barStyle
  });
}

ScrollBar.defaultProps = {
  background: "rgba(0,0,0,.5)",
  direction: "vertical",
  shortSide: 4,
  longSide: 0,
  offset: 0
};