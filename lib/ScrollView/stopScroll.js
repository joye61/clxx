"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.passiveSupported = void 0;
var passiveSupported = false;
exports.passiveSupported = passiveSupported;

try {
  var options = Object.defineProperty({}, "passive", {
    get: function get() {
      exports.passiveSupported = passiveSupported = true;
    }
  });
  window.addEventListener("testpassive", null, options);
} catch (err) {}

document.documentElement.addEventListener("touchstart", function (e) {
  e.preventDefault();
}, passiveSupported ? {
  passive: false
} : false);