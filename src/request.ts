import axios, { AxiosRequestConfig } from "axios";
import { Loading, LoadingOption } from "./Loading";
import querystring from "qs";

export { default as rawRequest } from "axios";

export interface RequestLoadingOption extends LoadingOption {
  minExistTime: number;
}

export interface RequestOption extends AxiosRequestConfig {
  url: string;
  loading?: RequestLoadingOption;
  transmitParam?: boolean;
}

export async function request(option: RequestOption) {
  // 默认不透传URL参数
  let transmitParam = !!option.transmitParam;
  // 如果loading存在，默认最小存在时间1000毫秒
  let minExistTime = 1000;
  if (option.loading && option.loading.minExistTime) {
    minExistTime = option.loading.minExistTime;
  }

  // 规范化url的Schema
  if (option.url.indexOf("//") === 0) {
    option.url = window.location.protocol + option.url;
  }

  // 显示加载进度条逻辑
  let loadingFinishFn = async () => {};
  if (typeof option.loading === "object") {
    const loadingStart = Date.now();
    const loadingComponent = new Loading(option.loading);

    loadingFinishFn = async () => {
      const current = Date.now();
      const diff = current - loadingStart;
      // 如果执行时还没到最小存在时间，则继续等待
      if (diff < minExistTime) {
        new Promise(resolve => {
          window.setTimeout(() => {
            loadingComponent.destroy();
            resolve();
          }, minExistTime - diff);
        });
      }
    };
  }

  // 当前页面的查询字符串参数透传功能
  if (transmitParam) {
    let appendParam: Object = {};
    const urlParam = querystring.parse(
      window.location.search.replace(/^\?*/, "")
    );
    appendParam = urlParam;

    // 透传Hash段的查询参数，兼容Hash路由查询模式
    const hashSearchStart = window.location.hash.indexOf("?");
    if (hashSearchStart > -1) {
      const hashSearch = window.location.hash.substring(hashSearchStart);
      const hashSearchParam = querystring.parse(hashSearch.replace(/^\?*/, ""));
      appendParam = { ...appendParam, ...hashSearchParam };
    }

    // 追加参数到当前参数列表
    if (typeof option.params === "object") {
      option.params = { ...option.params, appendParam };
    } else {
      option.params = appendParam;
    }
  }

  // 通过axios获取数据
  const response = await axios(option);
  // 等待加载动画结束（如果有）
  await loadingFinishFn();

  // 直接返回结果，将错误交给用户
  return response;
}
