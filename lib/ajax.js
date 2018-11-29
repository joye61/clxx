"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ajax;
exports.get = get;
exports.post = post;

var _querystring = _interopRequireDefault(require("querystring"));

var _isPlainObject = _interopRequireDefault(require("lodash/isPlainObject"));

var _url = require("url");

var _Loading = _interopRequireDefault(require("./Loading"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

if (typeof window.URL === "undefined") {
  window.URL = _url.URL;
  window.URLSearchParams = _url.URLSearchParams;
}
/**
 *
 * @param {*} option
 * {
 *  url: string; // 请求url地址
 *  method?: string; // 请求方式
 *  data?: any; // 请求数据
 *  headers?: any; // 请求头
 *  credentials?: string; // 设置认证模式
 *  loadingTimeLimit?: number; // 加载进度显示时间，单位毫秒
 *  showLoading?: false; // 显示加载进度效果，注意开启加载进度效果需要包含对应的CSS资源文件
 *  timeLimit?: number; // 超时时长，单位毫秒
 *  onTimeOut?: function; // 超时回调
 *  onLoad?: function; // 加载数据回调
 *  onError?: function; // 错误回调
 *  transmitParam?: boolean; // 是否透传url参数
 * }
 *
 */


function ajax(option) {
  if (!option.url) {
    throw new Error("Request url can not be null");
  } // 参数默认值


  var defaultOption = {
    method: "GET",
    headers: {},
    credentials: "omit",
    loadingTimeLimit: 1000,
    showLoading: false,
    timeLimit: 15000,
    onTimeOut: function onTimeOut() {},
    onLoad: function onLoad() {},
    // onError: () => {},
    transmitParam: false
  };
  option = _objectSpread({}, defaultOption, option);
  option.method = option.method.toUpperCase(); // 加载效果显示逻辑

  var loading;
  var loadingStartTime = Date.now();
  var destroyLoading;

  if (option.showLoading) {
    loading = new _Loading.default(); // loadingStartTime = Date.now();

    destroyLoading = function destroyLoading() {
      var now = Date.now();
      var diff = now - loadingStartTime;

      if (diff > option.loadingTimeLimit) {
        loading.destroy();
      } else {
        window.setTimeout(function () {
          loading.destroy();
        }, option.loadingTimeLimit - diff);
      }
    };
  } // 超时逻辑


  var timeoutFlag = false;
  var timeoutTimer = window.setTimeout(function () {
    // 执行到定时器，说明已经超时了
    timeoutFlag = true;
  }, option.timeLimit); // 处理url，生成URL对象

  var url = new _url.URL(option.url);
  var appendParam = {}; // 当前页面的查询字符串参数透传

  if (option.transmitParam) {
    var urlParam = _querystring.default.parse(window.location.search.replace(/^\?*/, ""));

    appendParam = _objectSpread({}, appendParam, urlParam); // 透传Hash段的查询参数，兼容Hash路由查询模式

    var hashSearchStart = window.location.hash.indexOf("?");

    if (hashSearchStart > -1) {
      var hashSearch = window.location.hash.substring(hashSearchStart);

      var hashSearchParam = _querystring.default.parse(hashSearch.replace(/^\?*/, ""));

      appendParam = _objectSpread({}, appendParam, hashSearchParam);
    }
  }

  if (option.data && (0, _isPlainObject.default)(option.data)) {
    // GET请求时，请求参数拼装进查询参数
    if (option.method === "GET") {
      appendParam = _objectSpread({}, appendParam, option.data);
    } // POST 请求时，封装data


    if (option.method === "POST" && !option.headers["Content-Type"]) {
      var postSearchParams = new _url.URLSearchParams();

      for (var key in option.data) {
        postSearchParams.append(key, option.data[key]);
      }

      option.data = postSearchParams;
      option.headers["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
    }
  } // 生成最终URL


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
    // 这里做超时逻辑检测
    if (timeoutFlag === true) {
      option.onTimeOut();
      return Promise.reject("Request time out");
    } // 执行到这里说明没有超时，清除定时器


    window.clearTimeout(timeoutTimer);
    return response.json();
  }).then(function (result) {
    if (loading instanceof _Loading.default) {
      destroyLoading();
    }

    option.onLoad(result);
  }).catch(function (error) {
    if (loading instanceof _Loading.default) {
      destroyLoading();
    }

    if (typeof option.onError === "function") {
      option.onError();
    } else {
      return Promise.reject(error);
    }
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
} // 模拟jQuery式get请求


function get() {
  var args = Array.prototype.slice.call(arguments);
  var option = createOption.bind.apply(createOption, [null, "GET"].concat(_toConsumableArray(args)))();
  ajax(option);
} // 模拟jQuery式post请求


function post() {
  var args = Array.prototype.slice.call(arguments);
  var option = createOption.bind.apply(createOption, [null, "POST"].concat(_toConsumableArray(args)))();
  ajax(option);
}