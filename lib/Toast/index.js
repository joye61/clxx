"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ToastComponent = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ToastComponent = function (_React$Component) {
  _inherits(ToastComponent, _React$Component);

  function ToastComponent() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ToastComponent);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ToastComponent)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      animationClass: "cl-Toast cl-Toast-show"
    });

    return _this;
  }

  _createClass(ToastComponent, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      window.setTimeout(function () {
        _this2.setState({
          animationClass: "cl-Toast cl-Toast-hide"
        });
      }, this.props.duration);
    }
  }, {
    key: "onAnimationEnd",
    value: function onAnimationEnd(e) {
      if (e.animationName === 'cl-Toast-hide' && typeof this.props.onEnd === "function") {
        this.props.onEnd();
      }
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: this.state.animationClass,
        onAnimationEnd: this.onAnimationEnd.bind(this)
      }, this.props.content);
    }
  }]);

  return ToastComponent;
}(_react.default.Component);

exports.ToastComponent = ToastComponent;

_defineProperty(ToastComponent, "defaultProps", {
  duration: 3000,
  onEnd: undefined
});

var Toast = function Toast(option) {
  var _this3 = this;

  _classCallCheck(this, Toast);

  _defineProperty(this, "container", document.createElement("div"));

  var config = {
    duration: 3000,
    position: "middle"
  };

  if (typeof option === "string") {
    config.content = option;
  }

  if (_typeof(option) === "object") {
    config = _objectSpread({}, config, option);
  }

  var className = "cl-Toast-container";

  if (config.position === "top") {
    className += " cl-Toast-container-top";
  } else if (config.position === "bottom") {
    className += " cl-Toast-container-bottom";
  } else {
    className += " cl-Toast-container-middle";
  }

  document.body.appendChild(this.container);

  _reactDom.default.render(_react.default.createElement("div", {
    className: className
  }, _react.default.createElement(ToastComponent, {
    content: config.content,
    duration: config.duration,
    onEnd: function onEnd() {
      _reactDom.default.unmountComponentAtNode(_this3.container);

      _this3.container.remove();
    }
  })), this.container);
};

exports.default = Toast;