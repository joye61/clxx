"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ticker = _interopRequireDefault(require("../ticker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var movement = {
  context: null,
  ticker: null,
  speed: null,
  elastic: 0,
  position: 0,
  state: 0,
  initialize: function initialize(context) {
    var onUpdate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
    this.context = context;
    this.onUpdate = onUpdate;
    this.ticker = new _ticker.default();
    this.moveHandler = this.move.bind(this);
    this.ticker.add(this.moveHandler);
    return this;
  },
  destroy: function destroy() {
    this.ticker.remove(this.moveHandler);
    this.ticker.destroy();
  },
  move: function move() {
    this.checkState();

    switch (this.state) {
      case 0:
        break;

      case 1:
        this.state1();
        break;

      case 2:
        this.state2();
        break;

      case 3:
        this.state3();
        break;

      case 4:
        this.state4();
        break;

      default:
        break;
    }
  },
  update: function update() {
    this.position += this.speed;

    if (this.state === 2) {
      if (this.position > this.context.scrollRange[1]) {
        this.position = this.context.scrollRange[1];
      }

      if (this.position < this.context.scrollRange[0]) {
        this.position = this.context.scrollRange[0];
      }
    }

    if (this.state === 4) {
      if (this.position <= this.context.scrollRange[1]) {
        this.position = this.context.scrollRange[1];
      }

      if (this.position >= this.context.scrollRange[0]) {
        this.position = this.context.scrollRange[0];
      }
    }

    if (this.position > this.context.scrollRange[1]) {
      this.elastic = this.context.scrollRange[1] - this.position;
    } else if (this.position < this.context.scrollRange[0]) {
      this.elastic = this.context.scrollRange[0] - this.position;
    } else {
      this.elastic = 0;
    }

    this.onUpdate(this.position);
  },
  state0: function state0() {},
  state1: function state1() {
    this.speed = this.context.handler.currentCoordinate - this.context.handler.lastCoordinate;
    this.context.handler.updatePoint();
    this.update();
  },
  state2: function state2() {},
  state3: function state3() {},
  state4: function state4() {},
  hasElastic: function hasElastic() {
    if (this.position < this.context.scrollRange[0] || this.position > this.context.scrollRange[1]) {
      return true;
    }

    return false;
  },
  checkState: function checkState() {
    if (!this.hasElastic() && !this.context.handler.isControl && this.speed === 0) {
      this.state = 0;
    } else if (!this.hasElastic() && this.context.handler.isControl) {
        this.state = 1;
      } else if (!this.hasElastic() && !this.context.handler.isControl && this.speed !== 0) {
          this.state = 2;
        } else if (this.hasElastic() && this.context.handler.isControl) {
            this.state = 3;
          } else if (this.hasElastic() && !this.context.handler.isControl) {
              this.state = 4;
            }
  }
};
var _default = movement;
exports.default = _default;