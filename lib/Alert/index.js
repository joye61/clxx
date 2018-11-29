"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Alert;
exports.AlertComponent = void 0;

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

var AlertComponent =
/*#__PURE__*/
function (_React$Component) {
  _inherits(AlertComponent, _React$Component);

  function AlertComponent() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, AlertComponent);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(AlertComponent)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      animationClass: "cl-Alert-show"
    });

    return _this;
  }

  _createClass(AlertComponent, [{
    key: "onAnimationEnd",
    value: function onAnimationEnd(e) {
      if (e.animationName === "cl-Alert-hide") {
        this.props.onHide();
      }
    }
  }, {
    key: "onCancel",
    value: function onCancel() {
      this.setState({
        animationClass: "cl-Alert-hide"
      });
      this.props.onCancel();
    }
  }, {
    key: "onConfirm",
    value: function onConfirm() {
      this.setState({
        animationClass: "cl-Alert-hide"
      });
      this.props.onConfirm();
    }
  }, {
    key: "showContent",
    value: function showContent() {
      if (typeof this.props.content === "string") {
        return _react.default.createElement("p", {
          className: "cl-Alert-content"
        }, this.props.content);
      }

      if (_react.default.isValidElement(this.props.content)) {
        return this.props.content;
      }
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: "cl-Alert"
      }, _react.default.createElement("div", {
        className: "cl-Alert-container ".concat(this.state.animationClass),
        onAnimationEnd: this.onAnimationEnd.bind(this)
      }, this.showContent(), _react.default.createElement("div", {
        className: "cl-Alert-btn"
      }, this.props.showCancel ? _react.default.createElement("div", {
        className: "cl-Alert-cancel",
        onClick: this.onCancel.bind(this),
        onTouchStart: function onTouchStart() {}
      }, this.props.cancelText) : null, _react.default.createElement("div", {
        className: "cl-Alert-confirm",
        onClick: this.onConfirm.bind(this),
        onTouchStart: function onTouchStart() {}
      }, this.props.confirmText))));
    }
  }]);

  return AlertComponent;
}(_react.default.Component);

exports.AlertComponent = AlertComponent;

_defineProperty(AlertComponent, "defaultProps", {
  content: "",
  showCancel: false,
  cancelText: "取消",
  confirmText: "确定",
  onConfirm: function onConfirm() {},
  onCancel: function onCancel() {},
  onHide: function onHide() {}
});

function Alert(option) {
  var props;

  if (typeof option === "string") {
    props = {
      content: option
    };
  } else if (_typeof(option) === "object") {
    props = option;
  } else {
    throw new Error("无效的参数");
  }

  var container = document.createElement("div");
  document.body.appendChild(container);

  props.onHide = function () {
    _reactDom.default.unmountComponentAtNode(container);

    container.remove();
  };

  _reactDom.default.render(_react.default.createElement(AlertComponent, props), container);
}