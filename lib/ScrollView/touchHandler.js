"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var touchHandler = {
  isControl: false,
  lastCoordinate: 0,
  currentCoordinate: 0,
  updatePoint: function updatePoint() {
    this.lastCoordinate = this.currentCoordinate;
  },
  onStart: function onStart(event) {
    if (!this.isControl) {
      event.stopPropagation();
      this.isControl = true;
      var target = event.touches[0];
      this.lastCoordinate = target.clientY;
      this.currentCoordinate = target.clientY;
    }
  },
  onMove: function onMove(event) {
    if (this.isControl) {
      var target = event.touches[0];
      this.currentCoordinate = target.clientY;
    }
  },
  onStop: function onStop() {
    if (this.isControl) {
      this.isControl = false;
      this.lastCoordinate = 0;
      this.currentCoordinate = 0;
    }
  }
};
var _default = touchHandler;
exports.default = _default;