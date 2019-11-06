var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
import { Loading } from "./Loading";
import querystring from "qs";
import { is } from "./is";
/**
 * 发送ajax请求
 * @param option RequestOption
 */
export function ajax(option) {
    return __awaiter(this, void 0, void 0, function* () {
        // 默认不透传URL参数
        let transmitParam = !!option.transmitParam;
        let transmitHashParam = !!option.transmitHashParam;
        if (!is.plainObject(option.params)) {
            option.params = {};
        }
        // 配置请求是否需要清除缓存
        if (!!option.disableHttpCache === true) {
            option.params.__c = Date.now();
        }
        // 如果loading存在，默认最小存在时间1000毫秒
        let minExistTime = 1000;
        let showLoading = false;
        let loadingConfig = {};
        if (typeof option.loading === "object") {
            if (typeof option.loading.minExistTime === "number") {
                minExistTime = option.loading.minExistTime;
            }
            showLoading = true;
            loadingConfig = Object.assign({}, option.loading);
        }
        else {
            showLoading = !!option.loading;
        }
        // 显示加载进度条逻辑
        let loadingFinishFn = () => __awaiter(this, void 0, void 0, function* () { });
        if (showLoading === true) {
            const loadingStart = Date.now();
            const loadingComponent = new Loading(loadingConfig);
            loadingFinishFn = () => __awaiter(this, void 0, void 0, function* () {
                const current = Date.now();
                const diff = current - loadingStart;
                // 如果执行时还没到最小存在时间，则继续等待
                if (diff < minExistTime) {
                    return new Promise(resolve => {
                        window.setTimeout(() => {
                            loadingComponent.destroy();
                            resolve();
                        }, minExistTime - diff);
                    });
                }
            });
        }
        // 当前页面的查询字符串参数透传功能
        if (transmitParam) {
            let appendParam = {};
            const urlParam = querystring.parse(window.location.search.replace(/^\?*/, ""));
            appendParam = urlParam;
            // 透传Hash段的查询参数，兼容Hash路由查询模式
            if (transmitHashParam) {
                const hashSearchStart = window.location.hash.indexOf("?");
                if (hashSearchStart > -1) {
                    const hashSearch = window.location.hash.substring(hashSearchStart);
                    const hashSearchParam = querystring.parse(hashSearch.replace(/^\?*/, ""));
                    appendParam = Object.assign(Object.assign({}, appendParam), hashSearchParam);
                }
            }
            // 追加参数到当前参数列表
            option.params = Object.assign(Object.assign({}, option.params), appendParam);
        }
        // 通过axios获取数据
        const response = yield axios(option);
        // 等待加载动画结束（如果有）
        yield loadingFinishFn();
        // 直接返回结果，将错误交给用户
        return response;
    });
}
