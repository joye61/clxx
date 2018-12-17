"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ajax;
exports.get = get;
exports.post = post;

var _querystring = _interopRequireDefault(require("querystring"));

var _isPlainObject = _interopRequireDefault(require("lodash/isPlainObject"));

var _Loading = _interopRequireDefault(require("./Loading"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

if (typeof URL === "undefined") {
  require("url-polyfill");
}

if (typeof fetch === "undefined") {
  require("whatwg-fetch");
}

if (typeof Promise === "undefined") {
  require("promise/lib/rejection-tracking").enable();

  window.Promise = require("promise/lib/es6-extensions.js");
}

function ajax(option) {
  if (!option.url) {
    throw new Error("Request url can not be null");
  }

  var defaultOption = {
    method: "GET",
    headers: {},
    credentials: "omit",
    showLoading: false,
    loadingConfig: {
      timeLimit: 1000
    },
    timeLimit: 15000,
    onTimeOut: function onTimeOut() {},
    onLoad: function onLoad() {},
    transmitParam: false
  };
  option = _objectSpread({}, defaultOption, option);
  option.method = option.method.toUpperCase();

  if (option.url.indexOf("//") === 0) {
    option.url = window.location.protocol + option.url;
  }

  var loading;
  var loadingStartTime = Date.now();
  var destroyLoading;

  if (option.showLoading) {
    loading = new _Loading.default(option.loadingConfig);

    destroyLoading = function destroyLoading() {
      var ondestroy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
      var now = Date.now();
      var diff = now - loadingStartTime;

      if (diff > option.loadingConfig.timeLimit) {
        loading.destroy();
        ondestroy();
      } else {
        window.setTimeout(function () {
          loading.destroy();
          ondestroy();
        }, option.loadingConfig.timeLimit - diff);
      }
    };
  }

  var timeoutFlag = false;
  var timeoutTimer = window.setTimeout(function () {
    timeoutFlag = true;
  }, option.timeLimit);
  var url = new URL(option.url);
  var appendParam = {};

  if (option.transmitParam) {
    var urlParam = _querystring.default.parse(window.location.search.replace(/^\?*/, ""));

    appendParam = _objectSpread({}, appendParam, urlParam);
    var hashSearchStart = window.location.hash.indexOf("?");

    if (hashSearchStart > -1) {
      var hashSearch = window.location.hash.substring(hashSearchStart);

      var hashSearchParam = _querystring.default.parse(hashSearch.replace(/^\?*/, ""));

      appendParam = _objectSpread({}, appendParam, hashSearchParam);
    }
  }

  if (option.data && (0, _isPlainObject.default)(option.data)) {
    if (option.method === "GET") {
      appendParam = _objectSpread({}, appendParam, option.data);
    }

    if (option.method === "POST" && !option.headers["Content-Type"]) {
      var postSearchParams = new URLSearchParams();

      for (var key in option.data) {
        postSearchParams.append(key, option.data[key]);
      }

      option.data = postSearchParams;
      option.headers["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
    }
  }

  for (var _key in appendParam) {
    url.searchParams.set(_key, appendParam[_key]);
  }

  var fetchOption = {
    method: option.method,
    headers: option.headers,
    credentials: option.credentials
  };

  if (option.method !== "GET") {
    fetchOption.body = option.data;
  }

  fetch(url.href, fetchOption).then(function (response) {
    if (timeoutFlag === true) {
      option.onTimeOut();
      return Promise.reject("Request time out");
    }

    window.clearTimeout(timeoutTimer);
    return response.json();
  }).then(function (result) {
    if (loading instanceof _Loading.default) {
      destroyLoading(function () {
        option.onLoad(result);
      });
    } else {
      option.onLoad(result);
    }
  }).catch(function (error) {
    var hasErrorHandler = typeof option.onError === "function";

    if (loading instanceof _Loading.default) {
      destroyLoading(function () {
        hasErrorHandler && option.onError();
      });
    } else {
      hasErrorHandler && option.onError();
    }

    return !hasErrorHandler && Promise.reject(error);
  });
}

function createOption(method) {
  var option = {
    method: method,
    url: arguments[1]
  };

  if (arguments[2]) {
    if (typeof arguments[2] === "function") {
      option.onLoad = arguments[2];
    }

    if ((0, _isPlainObject.default)(arguments[2])) {
      option.data = arguments[2];

      if (arguments[3] && typeof arguments[3] === "function") {
        option.onLoad = arguments[3];
      }
    }
  }

  return option;
}

function get() {
  var args = Array.prototype.slice.call(arguments);
  var option = createOption.bind.apply(createOption, [null, "GET"].concat(_toConsumableArray(args)))();
  ajax(option);
}

function post() {
  var args = Array.prototype.slice.call(arguments);
  var option = createOption.bind.apply(createOption, [null, "POST"].concat(_toConsumableArray(args)))();
  ajax(option);
}