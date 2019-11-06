import axios, { AxiosRequestConfig } from "axios";
import { Loading, LoadingOption } from "./Loading";
import querystring from "qs";
import { is } from "./is";

export interface RequestLoadingOption extends LoadingOption {
  minExistTime?: number;
}

export interface RequestOption extends AxiosRequestConfig {
  loading?: RequestLoadingOption | boolean;
  disableHttpCache?: boolean;
  transmitParam?: boolean;
  transmitHashParam?: boolean;
}

/**
 * 发送ajax请求
 * @param option RequestOption
 */
export async function ajax(option: RequestOption) {
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
  let loadingConfig: any = {};
  if (typeof option.loading === "object") {
    if (typeof option.loading.minExistTime === "number") {
      minExistTime = option.loading.minExistTime;
    }
    showLoading = true;
    loadingConfig = { ...option.loading };
  } else {
    showLoading = !!option.loading;
  }

  // 显示加载进度条逻辑
  let loadingFinishFn = async () => {};
  if (showLoading === true) {
    const loadingStart = Date.now();
    const loadingComponent = new Loading(loadingConfig);
    loadingFinishFn = async () => {
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
    if (transmitHashParam) {
      const hashSearchStart = window.location.hash.indexOf("?");
      if (hashSearchStart > -1) {
        const hashSearch = window.location.hash.substring(hashSearchStart);
        const hashSearchParam = querystring.parse(
          hashSearch.replace(/^\?*/, "")
        );
        appendParam = { ...appendParam, ...hashSearchParam };
      }
    }

    // 追加参数到当前参数列表
    option.params = { ...option.params, ...appendParam };
  }

  // 通过axios获取数据
  const response = await axios(option);
  // 等待加载动画结束（如果有）
  await loadingFinishFn();

  // 直接返回结果，将错误交给用户
  return response;
}
