"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var querystring_1 = __importDefault(require("querystring"));
var isPlainObject_1 = __importDefault(require("lodash/isPlainObject"));
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
        onTimeOut: function () { },
        onLoad: function () { },
        transmitParam: false
    };
    option = __assign({}, defaultOption, option);
    option.method = option.method.toUpperCase();
    if (option.url.indexOf("//") === 0) {
        option.url = window.location.protocol + option.url;
    }
    var loading;
    var loadingStartTime = Date.now();
    var destroyLoading;
    if (option.showLoading) {
        if (typeof option.loadingConfig.timeLimit === "undefined") {
            option.loadingConfig.timeLimit = 1000;
        }
        loading = new Loading(option.loadingConfig);
        destroyLoading = function (ondestroy) {
            if (ondestroy === void 0) { ondestroy = function () { }; }
            var now = Date.now();
            var diff = now - loadingStartTime;
            if (diff > option.loadingConfig.timeLimit) {
                loading.destroy();
                ondestroy();
            }
            else {
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
    var appendParam = {};
    if (option.transmitParam) {
        var urlParam = querystring_1.default.parse(window.location.search.replace(/^\?*/, ""));
        appendParam = __assign({}, appendParam, urlParam);
        var hashSearchStart = window.location.hash.indexOf("?");
        if (hashSearchStart > -1) {
            var hashSearch = window.location.hash.substring(hashSearchStart);
            var hashSearchParam = querystring_1.default.parse(hashSearch.replace(/^\?*/, ""));
            appendParam = __assign({}, appendParam, hashSearchParam);
        }
    }
    var queryParam = "";
    if (option.data && isPlainObject_1.default(option.data)) {
        if (option.method === "GET") {
            appendParam = __assign({}, appendParam, option.data);
            queryParam = querystring_1.default.stringify(appendParam);
        }
        if (option.method === "POST") {
            option.data = querystring_1.default.stringify(option.data);
            option.headers["Content-Type"] =
                "application/x-www-form-urlencoded;charset=UTF-8";
        }
    }
    option.url = option.url.replace(/(\?*|&*)$/, "");
    if (queryParam) {
        if (/\?/.test(option.url)) {
            option.url += "&" + queryParam;
        }
        else {
            option.url += "?" + queryParam;
        }
    }
    var fetchOption = {
        method: option.method,
        headers: option.headers,
        credentials: option.credentials
    };
    if (option.method === "POST") {
        fetchOption.body = option.data;
    }
    fetch(option.url, fetchOption)
        .then(function (response) {
        if (timeoutFlag === true) {
            option.onTimeOut();
            return Promise.reject("Request time out");
        }
        window.clearTimeout(timeoutTimer);
        return response.json();
    })
        .then(function (result) {
        if (loading instanceof Loading) {
            destroyLoading(function () {
                option.onLoad(result);
            });
        }
        else {
            option.onLoad(result);
        }
    })
        .catch(function (error) {
        var hasErrorHandler = typeof option.onError === "function";
        if (loading instanceof Loading) {
            destroyLoading(function () {
                hasErrorHandler && option.onError();
            });
        }
        else {
            hasErrorHandler && option.onError();
        }
        return !hasErrorHandler && Promise.reject(error);
    });
}
exports.default = ajax;
function createOption(method) {
    var option = {
        method: method,
        url: arguments[1]
    };
    if (arguments[2]) {
        if (typeof arguments[2] === "function") {
            option.onLoad = arguments[2];
        }
        if (isPlainObject_1.default(arguments[2])) {
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
    var option = createOption.bind.apply(createOption, [null, "GET"].concat(args))();
    ajax(option);
}
exports.get = get;
function post() {
    var args = Array.prototype.slice.call(arguments);
    var option = createOption.bind.apply(createOption, [null, "POST"].concat(args))();
    ajax(option);
}
exports.post = post;
