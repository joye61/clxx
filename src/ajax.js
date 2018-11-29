import querystring from "querystring";
import isPlainObject from "lodash/isPlainObject";
import { URL, URLSearchParams } from "url";
import Loading from "./Loading";

if (typeof window.URL === "undefined") {
  window.URL = URL;
  window.URLSearchParams = URLSearchParams;
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
export default function ajax(option) {
  if (!option.url) {
    throw new Error("Request url can not be null");
  }

  // 参数默认值
  const defaultOption = {
    method: "GET",
    headers: {},
    credentials: "omit",
    loadingTimeLimit: 1000,
    showLoading: false,
    timeLimit: 15000,
    onTimeOut: () => {},
    onLoad: () => {},
    // onError: () => {},
    transmitParam: false
  };
  option = { ...defaultOption, ...option };
  option.method = option.method.toUpperCase();

  // 加载效果显示逻辑
  let loading;
  let loadingStartTime = Date.now();
  let destroyLoading;
  if (option.showLoading) {
    loading = new Loading();
    // loadingStartTime = Date.now();
    destroyLoading = () => {
      let now = Date.now();
      let diff = now - loadingStartTime;
      if (diff > option.loadingTimeLimit) {
        loading.destroy();
      } else {
        window.setTimeout(() => {
          loading.destroy();
        }, option.loadingTimeLimit - diff);
      }
    };
  }

  // 超时逻辑
  let timeoutFlag = false;
  let timeoutTimer = window.setTimeout(() => {
    // 执行到定时器，说明已经超时了
    timeoutFlag = true;
  }, option.timeLimit);

  // 处理url，生成URL对象
  const url = new URL(option.url);
  let appendParam = {};

  // 当前页面的查询字符串参数透传
  if (option.transmitParam) {
    const urlParam = querystring.parse(
      window.location.search.replace(/^\?*/, "")
    );
    appendParam = { ...appendParam, ...urlParam };

    // 透传Hash段的查询参数，兼容Hash路由查询模式
    const hashSearchStart = window.location.hash.indexOf("?");
    if (hashSearchStart > -1) {
      const hashSearch = window.location.hash.substring(hashSearchStart);
      const hashSearchParam = querystring.parse(hashSearch.replace(/^\?*/, ""));
      appendParam = { ...appendParam, ...hashSearchParam };
    }
  }

  if (option.data && isPlainObject(option.data)) {
    // GET请求时，请求参数拼装进查询参数
    if (option.method === "GET") {
      appendParam = { ...appendParam, ...option.data };
    }

    // POST 请求时，封装data
    if (option.method === "POST" && !option.headers["Content-Type"]) {
      const postSearchParams = new URLSearchParams();
      for (let key in option.data) {
        postSearchParams.append(key, option.data[key]);
      }
      option.data = postSearchParams;
      option.headers["Content-Type"] =
        "application/x-www-form-urlencoded;charset=UTF-8";
    }
  }

  // 生成最终URL
  for (let key in appendParam) {
    url.searchParams.set(key, appendParam[key]);
  }

  let fetchOption = {
    method: option.method,
    headers: option.headers,
    credentials: option.credentials
  };
  if (option.method !== "GET") {
    fetchOption.body = option.data;
  }

  fetch(url.href, fetchOption)
    .then(response => {
      // 这里做超时逻辑检测
      if (timeoutFlag === true) {
        option.onTimeOut();
        return Promise.reject("Request time out");
      }

      // 执行到这里说明没有超时，清除定时器
      window.clearTimeout(timeoutTimer);
      return response.json();
    })
    .then(result => {
      if (loading instanceof Loading) {
        destroyLoading();
      }
      option.onLoad(result);
    })
    .catch(error => {
      if (loading instanceof Loading) {
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
  const option = {
    method,
    url: arguments[1]
  };

  if (arguments[2]) {
    if (typeof arguments[2] === "function") {
      option.onLoad = arguments[2];
    }
    if (isPlainObject(arguments[2])) {
      option.data = arguments[2];
      if (arguments[3] && typeof arguments[3] === "function") {
        option.onLoad = arguments[3];
      }
    }
  }

  return option;
}

// 模拟jQuery式get请求
export function get() {
  const args = Array.prototype.slice.call(arguments);
  const option = createOption.bind(null, "GET", ...args)();
  ajax(option);
}

// 模拟jQuery式post请求
export function post() {
  const args = Array.prototype.slice.call(arguments);
  const option = createOption.bind(null, "POST", ...args)();
  ajax(option);
}
