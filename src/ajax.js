import querystring from "querystring";
import isPlainObject from "lodash/isPlainObject";
import Loading from "./Loading";

/**
 *
 * @param {*} option
 * {
 *  url: string; // 请求url地址
 *  method?: string; // 请求方式
 *  data?: any; // 请求数据
 *  headers?: any; // 请求头
 *  credentials?: string; // 设置认证模式
 *  showLoading?: false; // 显示加载进度效果，注意开启加载进度效果需要包含对应的CSS资源文件
 *  loadingConfig?: { // 加载组件配置
 *    timeLimit?: number; // 加载进度最小显示时间，单位毫秒，默认1000ms
 *    ...; // 其他Loading组件配置项
 *  }
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
    showLoading: false,
    loadingConfig: {
      timeLimit: 1000
    },
    timeLimit: 15000,
    onTimeOut: () => {},
    onLoad: () => {},
    // onError: () => {}, // 如果没有错误处理函数，则错误会抛出
    transmitParam: false
  };

  // 配置项合并
  option = { ...defaultOption, ...option };

  // 允许方法任意大小写
  option.method = option.method.toUpperCase();

  // 规范化url的Schema
  if (option.url.indexOf("//") === 0) {
    option.url = window.location.protocol + option.url;
  }

  // 加载效果显示逻辑
  let loading;
  let loadingStartTime = Date.now();
  let destroyLoading;
  if (option.showLoading) {
    // 如果动画显示时长未设置，设置默认值
    if (typeof option.loadingConfig.timeLimit === "undefined") {
      option.loadingConfig.timeLimit = 1000;
    }

    loading = new Loading(option.loadingConfig);
    destroyLoading = (ondestroy = () => {}) => {
      let now = Date.now();
      let diff = now - loadingStartTime;
      if (diff > option.loadingConfig.timeLimit) {
        loading.destroy();
        ondestroy();
      } else {
        window.setTimeout(() => {
          loading.destroy();
          ondestroy();
        }, option.loadingConfig.timeLimit - diff);
      }
    };
  }

  // 超时逻辑
  let timeoutFlag = false;
  let timeoutTimer = window.setTimeout(() => {
    // 执行到定时器，说明已经超时了
    timeoutFlag = true;
  }, option.timeLimit);

  // 查询字符串对象构建
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

  let queryParam = "";
  if (option.data && isPlainObject(option.data)) {
    // GET请求时，请求参数拼装进查询参数
    if (option.method === "GET") {
      appendParam = { ...appendParam, ...option.data };
      queryParam = querystring.stringify(appendParam);
    }

    // POST 请求时，封装data
    if (option.method === "POST") {
      option.data = querystring.stringify(option.data);
      option.headers["Content-Type"] =
        "application/x-www-form-urlencoded;charset=UTF-8";
    }
  }

  // 生成最终url
  option.url = option.url.replace(/(\?*|&*)$/, "");
  if (queryParam) {
    if (/\?/.test(option.url)) {
      option.url += `&${queryParam}`;
    } else {
      option.url += `?${queryParam}`;
    }
  }

  let fetchOption = {
    method: option.method,
    headers: option.headers,
    credentials: option.credentials
  };
  if (option.method === "POST") {
    fetchOption.body = option.data;
  }

  fetch(option.url, fetchOption)
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
        // 如果有loading，需要等到loading销毁才执行回调
        destroyLoading(() => {
          option.onLoad(result);
        });
      } else {
        option.onLoad(result);
      }
    })
    .catch(error => {
      const hasErrorHandler = typeof option.onError === "function";

      if (loading instanceof Loading) {
        // 如果有loading，需要等到loading销毁才执行回调
        destroyLoading(() => {
          hasErrorHandler && option.onError();
        });
      } else {
        hasErrorHandler && option.onError();
      }

      return !hasErrorHandler && Promise.reject(error);
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
