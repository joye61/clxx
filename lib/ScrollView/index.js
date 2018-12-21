"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _ticker = _interopRequireDefault(require("../ticker"));

var _env = require("./env");

var _handler = _interopRequireDefault(require("./handler"));

var _task = _interopRequireDefault(require("./task"));

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

var ScrollView = function (_React$Component) {
  _inherits(ScrollView, _React$Component);

  function ScrollView(props) {
    var _this;

    _classCallCheck(this, ScrollView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ScrollView).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "containerRef", _react.default.createRef());

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "contentRef", _react.default.createRef());

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "containerSize", 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "contentSize", 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      position: 0,
      barSize: 0
    });

    _this.stopDefaultScroll = function (event) {
      return event.preventDefault();
    };

    _this.handler = new _handler.default();
    _this.onTouchStart = _this.handler.onStart.bind(_this.handler);
    _this.onTouchMove = _this.handler.onMove.bind(_this.handler);
    _this.onTouchEnd = _this.handler.onStop.bind(_this.handler);
    _this.onTouchNormalControl = _task.default.onTouchNormalControl.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onInertiaNormal = _task.default.onInertiaNormal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(ScrollView, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.refreshSize();
      this.ticker = new _ticker.default();
      this.ticker.add(this.onTouchNormalControl);
      this.ticker.add(this.onInertiaNormal);
      document.documentElement.addEventListener("touchmove", this.stopDefaultScroll, _env.passiveSupported ? {
        passive: false
      } : false);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.documentElement.removeEventListener("touchmove", this.stopDefaultScroll);
      this.ticker.destroy();
    }
  }, {
    key: "refreshSize",
    value: function refreshSize() {
      this.containerSize = this.containerRef.current.getBoundingClientRect().height;
      this.contentSize = this.contentRef.current.getBoundingClientRect().height;
      this.range = [this.containerSize - this.contentSize, 0];

      if (this.props.showScrollBar) {
        this.setState({
          barSize: Math.pow(this.containerSize, 2) / this.contentSize
        });
      }
    }
  }, {
    key: "showScrollBar",
    value: function showScrollBar() {
      if (this.props.showScrollBar) {
        var offset = Math.abs(this.state.position) * this.state.barSize / this.containerSize;

        var barStyle = _defineProperty({
          background: "rgba(0,0,0,.5)",
          position: "absolute",
          height: "".concat(this.state.barSize, "px"),
          top: 0,
          right: 0,
          width: "4px"
        }, _env.reactTransformAttr, "translate3d(0, ".concat(offset, "px, 0)"));

        return _react.default.createElement("div", {
          style: barStyle
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _contentStyle;

      var containerClass = "cl-ScrollView";

      if (typeof this.props.className === "string") {
        containerClass += " ".concat(this.props.className);
      }

      var containerStyle = {
        position: "relative",
        overflow: "hidden",
        height: "100%"
      };

      if (_typeof(this.props.style) === "object") {
        containerStyle = _objectSpread({}, containerStyle, this.props.style);
      }

      var contentStyle = (_contentStyle = {
        position: "absolute"
      }, _defineProperty(_contentStyle, _env.reactTransformAttr, "translate3d(0, ".concat(this.state.position, "px, 0)")), _defineProperty(_contentStyle, "width", "100%"), _contentStyle);
      return _react.default.createElement("div", {
        ref: this.containerRef,
        style: containerStyle,
        className: containerClass,
        onTouchStart: this.onTouchStart,
        onTouchMove: this.onTouchMove,
        onTouchEnd: this.onTouchEnd,
        onTouchCancel: this.onTouchEnd
      }, _react.default.createElement("div", {
        ref: this.contentRef,
        style: contentStyle
      }, this.props.children), this.showScrollBar());
    }
  }]);

  return ScrollView;
}(_react.default.Component);

exports.default = ScrollView;