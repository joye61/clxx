"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ToastComponent = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "container", _react.default.createRef());

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      show: false
    });

    return _this;
  }

  _createClass(ToastComponent, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var el = this.container.current;
      el.classList.add("cl-Toast-show");
      window.setTimeout(function () {
        el.classList.remove("cl-Toast-show");
        el.classList.add("cl-Toast-hide");
      }, this.props.duration);
    }
  }, {
    key: "onTransitionEnd",
    value: function onTransitionEnd() {
      var el = this.container.current;

      if (el.classList.contains("cl-Toast-hide") && typeof this.props.onEnd === "function") {
        this.props.onEnd();
      }
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: "cl-Toast",
        onTransitionEnd: this.onTransitionEnd.bind(this),
        ref: this.container
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

var Toast = function Toast(content) {
  var _this2 = this;

  var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3000;

  _classCallCheck(this, Toast);

  _defineProperty(this, "container", document.createElement("div"));

  document.body.appendChild(this.container);

  _reactDom.default.render(_react.default.createElement(ToastComponent, {
    content: content,
    duration: duration,
    onEnd: function onEnd() {
      _reactDom.default.unmountComponentAtNode(_this2.container);

      _this2.container.remove();
    }
  }), this.container);
};

exports.default = Toast;