"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./stopScroll");

var _react = _interopRequireDefault(require("react"));

var _ticker = _interopRequireDefault(require("../ticker"));

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

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "diffRect", {
      x: 0,
      y: 0
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "ticker", null);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "isTouching", false);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "isInertia", false);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "coordinate", {
      x: 0,
      y: 0
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "moveCoordinate", {
      x: 0,
      y: 0
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "offset", {
      x: 0,
      y: 0
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "factor", 0.97);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "speed", 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      position: 0,
      barSize: 0,
      barOffset: 0
    });

    _this.getTransformAttr();

    _this.frameDragTask = _this.frameDrag.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.frameInertiaTask = _this.frameInertia.bind(_assertThisInitialized(_assertThisInitialized(_this)));
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
        this.transformAttr = "transform";
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
      this.refreshSize();
    }
  }, {
    key: "refreshSize",
    value: function refreshSize() {
      this.containerRect = this.container.getBoundingClientRect();
      this.contentRect = this.content.getBoundingClientRect();
      this.diffRect = {
        x: this.containerRect.width - this.contentRect.width,
        y: this.containerRect.height - this.contentRect.height
      };

      if (this.props.showScrollBar && this.diffRect[this.getAxis()] < 0) {
        this.refreshBarSize();
      }
    }
  }, {
    key: "refreshBarSize",
    value: function refreshBarSize() {
      var barSize = Math.pow(this.containerRect.height, 2) / this.contentRect.height;
      var barOffset = Math.abs(this.state.position) * barSize / this.containerRect.height;

      if (this.getAxis() === "x") {
        barSize = Math.pow(this.containerRect.width, 2) / this.contentRect.width;
        barOffset = Math.abs(this.state.position) * barSize / this.containerRect.width;
      }

      this.setState({
        barSize: barSize,
        barOffset: barOffset
      });
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
      hasChange && this.refreshSize();
    }
  }, {
    key: "getAxis",
    value: function getAxis() {
      return this.props.direction === "horizontal" ? "x" : "y";
    }
  }, {
    key: "getPosition",
    value: function getPosition(position) {
      var range = [this.diffRect[this.getAxis()], 0];

      if (position <= range[0]) {
        position = range[0];
        this.speed = 0;
      } else if (position >= range[1]) {
        position = range[1];
        this.speed = 0;
      }

      return position;
    }
  }, {
    key: "frameDrag",
    value: function frameDrag() {
      this.offset = {
        x: this.moveCoordinate.x - this.coordinate.x,
        y: this.moveCoordinate.y - this.coordinate.y
      };
      this.coordinate = this.moveCoordinate;
      var axis = this.getAxis();
      var position = this.getPosition(this.state.position + this.offset[axis]);

      if (this.state.position !== position) {
        this.setState({
          position: position
        });
        this.refreshBarSize();
      }
    }
  }, {
    key: "frameInertia",
    value: function frameInertia() {
      this.speed *= this.factor;

      if (Math.abs(this.speed) <= 0.5) {
        this.isInertia = false;
        this.speed = 0;
        this.ticker.destroy();
      } else {
          var position = this.getPosition(this.state.position + this.speed);

          if (this.state.position !== position) {
            this.setState({
              position: position
            });
            this.refreshBarSize();
          }
        }
    }
  }, {
    key: "start",
    value: function start(e) {
      if (this.diffRect[this.getAxis()] >= 0) {
        return;
      }

      if (this.isInertia) {
        this.isInertia = false;
        this.speed = 0;
        this.ticker.destroy();
      }

      if (!this.isTouching) {
        e.stopPropagation();
        this.isTouching = true;
        var target = e.touches[0];
        this.coordinate = this.moveCoordinate = {
          x: target.clientX,
          y: target.clientY
        };
        this.ticker = new _ticker.default();
        this.ticker.add(this.frameDragTask);
      }
    }
  }, {
    key: "move",
    value: function move(e) {
      if (this.isTouching) {
        var target = e.touches[0];
        this.moveCoordinate = {
          x: target.clientX,
          y: target.clientY
        };
      }
    }
  }, {
    key: "end",
    value: function end(e) {
      if (this.isTouching) {
        this.isTouching = false;
        this.speed = this.offset[this.getAxis()];

        if (this.speed !== 0) {
          this.isInertia = true;
          this.ticker.remove(this.frameDragTask);
          this.ticker.add(this.frameInertiaTask);
        } else {
            this.ticker.destroy();
          }
      }
    }
  }, {
    key: "getTransform",
    value: function getTransform() {
      var _this2 = this;

      var translate = function translate() {
        var str = "translate3d(0, ".concat(_this2.state.position, "px, 0)");

        if (_this2.getAxis() === "x") {
          str = "translate3d(".concat(_this2.state.position, "px, 0, 0)");
        }

        return str;
      };

      return _defineProperty({}, this.transformAttr, translate());
    }
  }, {
    key: "showScrollBar",
    value: function showScrollBar() {
      var axis = this.getAxis();

      if (this.props.showScrollBar && this.diffRect[axis] < 0) {
        var _style;

        var style = (_style = {}, _defineProperty(_style, this.transformAttr, "translate3d(0, ".concat(this.state.barOffset, "px, 0)")), _defineProperty(_style, "height", "".concat(this.state.barSize, "px")), _defineProperty(_style, "top", 0), _defineProperty(_style, "right", 0), _defineProperty(_style, "width", "4px"), _style);

        if (axis === "x") {
          var _style2;

          style = (_style2 = {}, _defineProperty(_style2, this.transformAttr, "translate3d(".concat(this.state.barOffset, "px, 0, 0)")), _defineProperty(_style2, "width", "".concat(this.state.barSize, "px")), _defineProperty(_style2, "left", 0), _defineProperty(_style2, "bottom", 0), _defineProperty(_style2, "height", "4px"), _style2);
        }

        return _react.default.createElement("div", {
          className: "cl-ScrollView-bar",
          style: style
        });
      }
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

      delete props.showScrollBar;
      return _react.default.createElement("div", _extends({
        ref: this.containerRef
      }, props, {
        onTouchStart: this.start.bind(this),
        onTouchMove: this.move.bind(this),
        onTouchEnd: this.end.bind(this),
        onTouchCancel: this.end.bind(this),
        onWheel: function onWheel(e) {}
      }), _react.default.createElement("div", {
        ref: this.contentRef,
        style: this.getTransform()
      }, this.props.children), this.showScrollBar());
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props) {
      if (typeof props.position === "number" && props.position !== this.state.position) {
        return {
          position: props.position
        };
      }

      return null;
    }
  }]);

  return ScrollView;
}(_react.default.Component);

exports.default = ScrollView;