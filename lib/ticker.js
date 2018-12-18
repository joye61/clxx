"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _raf = _interopRequireDefault(require("raf"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Ticker = function () {
  function Ticker(interval) {
    var _this = this;

    _classCallCheck(this, Ticker);

    _defineProperty(this, "tasks", []);

    _defineProperty(this, "frameId", 0);

    _defineProperty(this, "isRun", true);

    var useInterval = false;

    if (typeof interval === "number" && interval > 1000 / 60) {
      useInterval = true;
    }

    var exec = function exec() {
      return _this.tasks.forEach(function (item) {
        return item();
      });
    };

    var start = Date.now();

    var frame = function frame() {
      if (_this.isRun === false) {
        return;
      }

      _this.frameId = (0, _raf.default)(frame);

      if (useInterval) {
        var current = Date.now();
        var diff = current - start;

        if (diff >= interval) {
          exec();
          start = current;
        }
      } else {
        exec();
      }
    };

    this.frameId = (0, _raf.default)(frame);
  }

  _createClass(Ticker, [{
    key: "add",
    value: function add(task) {
      if (typeof task === "function") {
        this.tasks.push(task);
      }
    }
  }, {
    key: "remove",
    value: function remove(task) {
      if (typeof task === "function") {
        var findIndex = -1;

        for (var i = 0; i < this.tasks.length; i++) {
          if (this.tasks[i] === task) {
            findIndex = i;
            break;
          }
        }

        if (findIndex >= 0) {
          this.tasks.splice(findIndex, 1);
        }
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.isRun = false;

      _raf.default.cancel(this.frameId);

      this.tasks = [];
    }
  }]);

  return Ticker;
}();

exports.default = Ticker;