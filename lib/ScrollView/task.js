"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Task = function () {
  function Task() {
    _classCallCheck(this, Task);
  }

  _createClass(Task, null, [{
    key: "updatePositionNormal",
    value: function updatePositionNormal() {
      var position = this.state.position + this.offset;

      if (position > this.range[1]) {
        position = this.range[1];
      } else if (position < this.range[0]) {
        position = this.range[0];
      }

      if (position !== this.state.position) {
        this.setState({
          position: position
        });
      }
    }
  }, {
    key: "onTouchNormalControl",
    value: function onTouchNormalControl() {
      if (this.handler.isControl && this.range[0] <= this.state.position && this.range[1] >= this.state.position) {
        this.offset = this.handler.currentCoordinate - this.handler.lastCoordinate;
        this.handler.lastCoordinate = this.handler.currentCoordinate;
        Task.updatePositionNormal.call(this);
      }
    }
  }, {
    key: "onInertiaNormal",
    value: function onInertiaNormal() {
      if (!this.handler.isControl && this.range[0] < this.state.position && this.range[1] > this.state.position && Math.abs(this.offset) !== 0) {
        this.offset = this.offset * Task.inertiaDecayFactor;

        if (Math.abs(this.offset) <= 0.5) {
          this.offset = 0;
        } else {
          Task.updatePositionNormal.call(this);
        }
      }
    }
  }, {
    key: "onTouchPullControll",
    value: function onTouchPullControll() {}
  }, {
    key: "onPullRelease",
    value: function onPullRelease() {}
  }, {
    key: "onPullRefresh",
    value: function onPullRefresh() {}
  }]);

  return Task;
}();

exports.default = Task;

_defineProperty(Task, "inertiaDecayFactor", 0.95);

_defineProperty(Task, "pullRefreshRange", 200);

_defineProperty(Task, "bounceFactor", 0.95);