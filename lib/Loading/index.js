"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WaveLoading = WaveLoading;
exports.HelixLoading = HelixLoading;
exports.DottedLoading = DottedLoading;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function LoadingMask(_ref) {
  var hintComponent = _ref.hintComponent,
      children = _ref.children;
  return _react.default.createElement("div", {
    className: "cl-Loading-mask"
  }, _react.default.createElement("div", {
    className: "cl-Loading"
  }, children, hintComponent));
}

function WaveLoading(_ref2) {
  var _ref2$color = _ref2.color,
      color = _ref2$color === void 0 ? "#fff" : _ref2$color;
  var list = [];

  for (var i = 0; i < 6; i++) {
    list.push(_react.default.createElement("span", {
      className: "cl-Loading-wave-item",
      key: i,
      style: {
        backgroundColor: color
      }
    }));
  }

  return _react.default.createElement("div", {
    className: "cl-Loading-wave-container"
  }, list);
}

function HelixLoading(_ref3) {
  var _ref3$color = _ref3.color,
      color = _ref3$color === void 0 ? "#fff" : _ref3$color;
  var list = [];

  for (var i = 0; i < 12; i++) {
    list.push(_react.default.createElement("div", {
      className: "cl-Loading-helix-item",
      key: i
    }, _react.default.createElement("span", {
      className: "cl-Loading-helix-itembar",
      style: {
        backgroundColor: color
      }
    })));
  }

  return _react.default.createElement("div", {
    className: "cl-Loading-helix-container"
  }, list);
}

function DottedLoading(_ref4) {
  var _ref4$color = _ref4.color,
      color = _ref4$color === void 0 ? "#fff" : _ref4$color;
  var list = [];

  for (var i = 0; i < 3; i++) {
    list.push(_react.default.createElement("span", {
      className: "cl-Loading-dotted-item",
      style: {
        backgroundColor: color
      }
    }));
  }

  return _react.default.createElement("div", {
    className: "cl-Loading-dotted-container"
  }, list);
}

var Loading = function () {
  function Loading(option) {
    _classCallCheck(this, Loading);

    _defineProperty(this, "container", document.createElement("div"));

    var config = {
      type: "wave",
      color: undefined,
      hintColor: "#fff"
    };

    if (typeof option === "string") {
      config.hint = option;
    }

    if (_typeof(option) === "object") {
      config = _objectSpread({}, config, option);
    }

    var Component = null;
    var type = config.type.toLowerCase();

    if (type === "wave") {
      Component = WaveLoading;
    } else if (type === "dotted") {
      Component = DottedLoading;
    } else if (type === "helix") {
      Component = HelixLoading;
    } else {
      throw new Error("Invalid loading type '".concat(config.type, "'"));
    }

    var hintComponent = null;

    if (typeof config.hint === "string") {
      hintComponent = _react.default.createElement("p", {
        className: "cl-Loading-hint",
        style: {
          color: config.hintColor
        }
      }, config.hint);
    }

    if (_react.default.isValidElement(config.hint)) {
      hintComponent = config.hint;
    }

    document.body.appendChild(this.container);

    _reactDom.default.render(_react.default.createElement(LoadingMask, {
      hintComponent: hintComponent
    }, _react.default.createElement(Component, {
      color: config.color || undefined
    })), this.container);
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