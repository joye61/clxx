"use strict";

var _rejectionTracking = _interopRequireDefault(require("promise/lib/rejection-tracking"));

var _es6Extensions = _interopRequireDefault(require("promise/lib/es6-extensions.js"));

require("whatwg-fetch");

require("url-polyfill");

var _objectAssign = _interopRequireDefault(require("object-assign"));

require("core-js/es6/symbol");

require("core-js/fn/array/from");

require("core-js/es6/map");

require("core-js/es6/set");

var _raf = _interopRequireDefault(require("raf"));

var _rem = _interopRequireDefault(require("./rem"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof Promise === 'undefined') {
  _rejectionTracking.default.enable();

  window.Promise = _es6Extensions.default;
}

Object.assign = _objectAssign.default;

_raf.default.polyfill(window);

(0, _rem.default)();