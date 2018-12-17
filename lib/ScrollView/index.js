"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./stopScroll");

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

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

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "isTouching", false);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "transformAttr", "transform");

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "coordinate", {
      x: 0,
      y: 0
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "coordinateOffset", {
      x: 0,
      y: 0
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      position: 0
    });

    _this.getTransformAttr();

    return _this;
  }

  _createClass(ScrollView, [{
    key: "getTransformAttr",
    value: function getTransformAttr() {
      var list = {
        webkit: "Webkit",
        moz: "Moz",
        ms: "ms",
        o: "O"
      };

      if (typeof document.body.style.transform === "string") {
        return;
      }

      for (var prefix in list) {
        if (typeof document.body.style["".concat(prefix, "Transform")] === "string") {
          this.transformAttr = "".concat(list[prefx], "Transform");
          return;
        }
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.container = this.containerRef.current;
      this.content = this.contentRef.current;
      this.containerRect = this.container.getBoundingClientRect();
      this.contentRect = this.content.getBoundingClientRect();
    }
  }, {
    key: "getSnapshotBeforeUpdate",
    value: function getSnapshotBeforeUpdate(props) {
      if (props.children !== this.props.children || props.children.length !== this.props.children.length) {
        return true;
      }

      return false;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(props, state, hasChange) {
      if (hasChange) {
        this.containerRect = this.container.getBoundingClientRect();
        this.contentRect = this.content.getBoundingClientRect();
      }
    }
  }, {
    key: "start",
    value: function start(e) {
      if (!this.isTouching) {
        this.isTouching = true;
        var target = e.touches[0];
        this.coordinate = {
          x: target.clientX,
          y: target.clientY
        };
      }
    }
  }, {
    key: "move",
    value: function move(e) {
      if (this.isTouching) {
        var target = e.touches[0];
        var currentCoordinate = {
          x: target.clientX,
          y: target.clientY
        };
        this.coordinateOffset = {
          x: currentCoordinate.x - this.coordinate.x,
          y: currentCoordinate.y - this.coordinate.y
        };
        this.coordinate = currentCoordinate;
      }
    }
  }, {
    key: "end",
    value: function end(e) {
      if (this.isTouching) {
        this.isTouching = false;
      }
    }
  }, {
    key: "getTransform",
    value: function getTransform() {
      var _this2 = this;

      var translate = function translate() {
        var str = "translate3d(0, ".concat(_this2.state.position, "px, 0)");

        if (_this2.props.direction === "horizontal") {
          str = "translate3d(".concat(_this2.state.position, "px, 0, 0)");
        }

        return str;
      };

      return _defineProperty({}, this.transformAttr, translate());
    }
  }, {
    key: "render",
    value: function render() {
      var containerClass = "cl-ScrollView";

      if (typeof this.props.className === "string") {
        containerClass += " ".concat(this.props.className);
      }

      var props = _objectSpread({}, this.props, {
        className: containerClass
      });

      return _react.default.createElement("div", _extends({
        ref: this.containerRef
      }, props, {
        onTouchStart: this.start.bind(this),
        onTouchMove: this.move.bind(this),
        onTouchEnd: this.end.bind(this),
        onTouchCancel: this.end.bind(this)
      }), _react.default.createElement("div", {
        ref: this.contentRef,
        style: this.getTransform()
      }, this.props.children));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props) {
      return {
        position: props.position || 0
      };
    }
  }]);

  return ScrollView;
}(_react.default.Component);

exports.default = ScrollView;