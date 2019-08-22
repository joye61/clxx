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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var Loading_1 = require("./Loading");
var qs_1 = __importDefault(require("qs"));
// 导出默认的axios对象
var axios_2 = require("axios");
exports.rawRequest = axios_2.default;
/**
 * 发送ajax请求
 * @param option RequestOption
 */
function request(option) {
    return __awaiter(this, void 0, void 0, function () {
        var transmitParam, transmitHashParam, minExistTime, showLoading, loadingConfig, loadingFinishFn, loadingStart_1, loadingComponent_1, appendParam, urlParam, hashSearchStart, hashSearch, hashSearchParam, response;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transmitParam = !!option.transmitParam;
                    transmitHashParam = !!option.transmitHashParam;
                    // 配置请求是否需要清除缓存
                    if (!option.httpCache) {
                        option.params = {
                            __c: Date.now()
                        };
                    }
                    minExistTime = 1000;
                    showLoading = false;
                    loadingConfig = {};
                    if (typeof option.loading === "object") {
                        if (typeof option.loading.minExistTime === "number") {
                            minExistTime = option.loading.minExistTime;
                        }
                        showLoading = true;
                        loadingConfig = __assign({}, option.loading);
                    }
                    else {
                        showLoading = !!option.loading;
                    }
                    loadingFinishFn = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); };
                    if (showLoading === true) {
                        loadingStart_1 = Date.now();
                        loadingComponent_1 = new Loading_1.Loading(loadingConfig);
                        loadingFinishFn = function () { return __awaiter(_this, void 0, void 0, function () {
                            var current, diff;
                            return __generator(this, function (_a) {
                                current = Date.now();
                                diff = current - loadingStart_1;
                                // 如果执行时还没到最小存在时间，则继续等待
                                if (diff < minExistTime) {
                                    return [2 /*return*/, new Promise(function (resolve) {
                                            window.setTimeout(function () {
                                                loadingComponent_1.destroy();
                                                resolve();
                                            }, minExistTime - diff);
                                        })];
                                }
                                return [2 /*return*/];
                            });
                        }); };
                    }
                    // 当前页面的查询字符串参数透传功能
                    if (transmitParam) {
                        appendParam = {};
                        urlParam = qs_1.default.parse(window.location.search.replace(/^\?*/, ""));
                        appendParam = urlParam;
                        // 透传Hash段的查询参数，兼容Hash路由查询模式
                        if (transmitHashParam) {
                            hashSearchStart = window.location.hash.indexOf("?");
                            if (hashSearchStart > -1) {
                                hashSearch = window.location.hash.substring(hashSearchStart);
                                hashSearchParam = qs_1.default.parse(hashSearch.replace(/^\?*/, ""));
                                appendParam = __assign({}, appendParam, hashSearchParam);
                            }
                        }
                        // 追加参数到当前参数列表
                        if (typeof option.params === "object") {
                            option.params = __assign({}, option.params, appendParam);
                        }
                        else {
                            option.params = appendParam;
                        }
                    }
                    return [4 /*yield*/, axios_1.default(option)];
                case 1:
                    response = _a.sent();
                    // 等待加载动画结束（如果有）
                    return [4 /*yield*/, loadingFinishFn()];
                case 2:
                    // 等待加载动画结束（如果有）
                    _a.sent();
                    // 直接返回结果，将错误交给用户
                    return [2 /*return*/, response];
            }
        });
    });
}
exports.request = request;
