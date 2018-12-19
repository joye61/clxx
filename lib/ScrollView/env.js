"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReactTransformAttr = getReactTransformAttr;
exports.isTouchSupport = exports.passiveSupported = void 0;
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
var isTouchSupport = typeof window.ontouchstart === "undefined" ? false : true;
exports.isTouchSupport = isTouchSupport;

function getReactTransformAttr() {
  var list = {
    webkit: "Webkit",
    moz: "Moz",
    ms: "ms",
    o: "O"
  };

  if (typeof document.body.style.transform === "string") {
    return "transform";
  }

  for (var prefix in list) {
    if (typeof document.body.style["".concat(prefix, "Transform")] === "string") {
      return "".concat(list[prefx], "Transform");
    }
  }
}