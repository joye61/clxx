"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// 自增回调索引
var callbackIndex = 0;

function _default(namespace, api, param) {
  var url = "chelunJSBridge://".concat(namespace, "/").concat(api); // 如果没有参数选项，直接发送请求

  if (!param || _typeof(param) !== "object") {
    sendRequest(url);
    return;
  }

  var hashIndex = undefined;
  var pairs = [];

  for (var key in param) {
    if (!param.hasOwnProperty(key)) {
      continue;
    }

    if (typeof param[key] === "function") {
      var _callbackIndex = generateIndex(param[key]);

      if (key === "callback") {
        hashIndex = _callbackIndex;
      } else {
        pairs.push("".concat(encodeURIComponent(key), "=").concat(_callbackIndex));
      }

      continue;
    }

    pairs.push("".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(param[key])));
  } // 判断是否有参数


  if (pairs.length > 0) {
    url += "?".concat(pairs.join("&"));
  } // 判断是否有hash统一回调


  if (hashIndex !== undefined && typeof hashIndex === "number") {
    url += "#".concat(hashIndex);
  }

  sendRequest(url);
}

function generateIndex(callback) {
  window["__MCL_CALLBACK_".concat(callbackIndex)] = callback;
  return callbackIndex += 1;
}

function sendRequest(url) {
  var temp = document.createElement("iframe");
  document.body.appendChild(temp);
  temp.style.display = "none";
  temp.src = url;

  temp.onload = function () {
    temp.remove();
  };

  window.setTimeout(function () {
    temp.remove();
  }, 0);
}