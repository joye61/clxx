"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _touchHandler = _interopRequireDefault(require("./touchHandler"));

var _movement = _interopRequireDefault(require("./movement"));

var _env = require("./env");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Scroll = function () {
  function Scroll(container) {
    _classCallCheck(this, Scroll);

    if (!container) {
      throw new Error("Should specify scroll container");
    }

    if (container instanceof Element) {
      this.container = container;
    } else if (typeof container === "string") {
      this.container = document.querySelector(container);
    }

    this.content = this.container.children.item(0);
    this.refreshSize();

    this.stopDefaultScrollHandler = function (event) {
      return event.preventDefault();
    };

    this.stopDefaulScroll();
    this.handler = _touchHandler.default;
    this.touchStartHandler = this.handler.onStart.bind(this.handler);
    this.touchMoveHandler = this.handler.onMove.bind(this.handler);
    this.touchEndHandler = this.handler.onStop.bind(this.handler);
    this.touchCancelHandler = this.handler.onStop.bind(this.handler);
    this.bindHandle();
    this.movement = _movement.default.initialize(this, this.updatePosition.bind(this));
  }

  _createClass(Scroll, [{
    key: "updatePosition",
    value: function updatePosition(position) {
      this.content.style.transform = "translate3d(0, ".concat(position, "px, 0)");
    }
  }, {
    key: "refreshSize",
    value: function refreshSize() {
      this.containerSize = this.container.getBoundingClientRect().height;
      this.contentSize = this.content.getBoundingClientRect().height;
      this.scrollRange = [this.containerSize - this.contentSize, 0];
    }
  }, {
    key: "stopDefaulScroll",
    value: function stopDefaulScroll() {
      document.documentElement.addEventListener("touchstart", this.stopDefaultScrollHandler, _env.passiveSupported ? {
        passive: false
      } : false);
    }
  }, {
    key: "recoverDefaultScroll",
    value: function recoverDefaultScroll() {
      document.documentElement.removeEventListener("touchstart", this.stopDefaultScrollHandler);
    }
  }, {
    key: "bindHandle",
    value: function bindHandle() {
      this.container.addEventListener("touchstart", this.touchStartHandler);
      this.container.addEventListener("touchmove", this.touchMoveHandler);
      this.container.addEventListener("touchend", this.touchEndHandler);
      this.container.addEventListener("touchcancel", this.touchCancelHandler);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.recoverDefaultScroll();
      this.container.removeEventListener("touchstart", this.touchStartHandler);
      this.container.removeEventListener("touchmove", this.touchMoveHandler);
      this.container.removeEventListener("touchend", this.touchEndHandler);
      this.container.removeEventListener("touchcancel", this.touchCancelHandler);
      this.movement.destroy();
    }
  }]);

  return Scroll;
}();

exports.default = Scroll;