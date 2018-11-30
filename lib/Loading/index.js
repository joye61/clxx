"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoadingComponent = LoadingComponent;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function LoadingComponent() {
  return _react.default.createElement("div", {
    className: "cl-Loading-mask"
  }, _react.default.createElement("div", {
    className: "cl-Loading"
  }, _react.default.createElement("div", {
    className: "cl-Loading-container"
  }, _react.default.createElement("span", null), _react.default.createElement("span", null), _react.default.createElement("span", null), _react.default.createElement("span", null), _react.default.createElement("span", null), _react.default.createElement("span", null))));
}

var Loading = function () {
  function Loading() {
    _classCallCheck(this, Loading);

    _defineProperty(this, "container", document.createElement('div'));

    document.body.appendChild(this.container);

    _reactDom.default.render(_react.default.createElement(LoadingComponent, null), this.container);
  }

  _createClass(Loading, [{
    key: "destroy",
    value: function destroy() {
      _reactDom.default.unmountComponentAtNode(this.container);

      this.container.remove();
    }
  }]);

  return Loading;
}();

exports.default = Loading;