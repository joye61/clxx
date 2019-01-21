import promiseRejectionTracking from "promise/lib/rejection-tracking";
import _Promise from "promise/lib/es6-extensions.js";
import "whatwg-fetch";
import "url-polyfill";
import assign from "object-assign";
import "core-js/es6/symbol";
import "core-js/fn/array/from";
import "core-js/es6/map";
import "core-js/es6/set";
import raf from "raf";
import initRem from "./rem";

if (typeof Promise === 'undefined') {
  promiseRejectionTracking.enable();
  window.Promise = _Promise;
}
Object.assign = assign;
raf.polyfill(window);

initRem();

