import isPlainObject from "lodash/isPlainObject";
import omit from "lodash/omit";
import isArrayBuffer from "lodash/isArrayBuffer";
import isTypedArray from "lodash/isTypedArray";
import { uniqKey } from "./uniqKey";

/**
 * normal: 普通的请求，参数都附加在URL后面，data为JSON对象或字符串
 * text: 请求体为text，data为字符串
 * form: 请求体为FormData，data为JSON对象或FormData
 * json: 请求体为JSON字符串，data为JSON对象
 * blob: 请求体为blob原始二进制，data只能为Blob
 * params: 请求体为URLSearchParams，data为JSON对象或URLSearchParams
 * buffer: 请求体data只能为ArrayBuffer、TypeArray、DataView
 */
export type SendType = "normal" | "text" | "form" | "json" | "blob" | "params" | "buffer";

// 发送的数据类型
export type SendDataType = BodyInit | Record<string, any>;

/**
 * 请求对象参数
 */
export interface RequestOption extends RequestInit {
  // 请求的URL地址
  url?: string;
  // 发送类型
  sendType?: SendType;
  // 请求的数据
  data?: SendDataType;
  // 禁用URL地址缓存
  disableUrlCache?: boolean;
  // ajax请求携带当前页面url的参数
  transmitPageParam?: boolean;
  // 超时时间，默认30秒
  timeout?: number;
}

export type BuildUrlOption = Pick<
  RequestOption,
  "url" | "data" | "disableUrlCache" | "transmitPageParam" | "sendType"
>;

export type StandardAjaxResult = {
  code: number;
  message?: string;
  data?: any;
};

// 用来全局存储host别名映射
let hostAliasMap: Record<string, string> = {};

/**
 * 注册Host别名
 * @param aliasMap
 * @returns
 */
export async function registerHostAlias(aliasMap: Record<string, string>) {
  if (!isPlainObject(aliasMap)) return;
  hostAliasMap = { ...hostAliasMap, ...aliasMap };
}

/**
 * 通过ajax选项构建Url
 * @param option
 */
export function buildUrlByOption(option: BuildUrlOption) {
  let config: BuildUrlOption = {
    url: "",
    sendType: "normal",
    data: {},
    disableUrlCache: false,
    transmitPageParam: false,
  };
  if (isPlainObject(option)) {
    config = { ...config, ...option };
  }
  if (!isPlainObject(config.data)) {
    config.data = {};
  }

  let url = config.url || "";
  const parts = url.split("@");
  // 如果URL中有@符号，按照别名模式处理
  if (parts.length === 2) {
    let host = hostAliasMap[parts[0]];
    if (host && typeof host === "string") {
      /**
       * 这一步两个作用
       * 1、删除前置 https://
       * 2、删除结尾的反斜杠 /
       */
      host = host.replace(/^(https?\:)?\/{2}|\/*$/g, "");
      host = window.location.protocol + "//" + host;
      url = host + "/" + parts[1].replace(/^\/*/, "");
    }
  }

  // 创建url对象
  let urlObject: URL;
  if (/^http/.test(url)) {
    urlObject = new URL(url);
  } else {
    // 这里是请求当前页面host的逻辑
    const { origin, pathname } = window.location;
    urlObject = new URL(url, origin + pathname);
  }

  // 透传当前页面的参数
  if (config.transmitPageParam) {
    const pageUrl = new URL(window.location.href);
    pageUrl.searchParams.forEach((value, key) => {
      urlObject.searchParams.append(key, value);
    });
  }

  // 如果是normal请求，将data中的数据作为url的查询字符串
  if (config.sendType?.toLowerCase() === "normal") {
    if (isPlainObject(config.data)) {
      const data = config.data as Record<string, any>;
      for (let key in data) {
        urlObject.searchParams.append(key, data[key]);
      }
    } else if (typeof config.data === "string") {
      const params = new URLSearchParams(config.data);
      params.forEach((value, key) => {
        urlObject.searchParams.append(key, value);
      });
    }
  }

  // 如果禁用了URL缓存，添加去缓存参数
  if (config.disableUrlCache) {
    urlObject.searchParams.append("__c", uniqKey());
  }

  // 返回URL地址
  return urlObject.toString();
}

/**
 * 解析请求选项
 * @param option
 * @returns
 */
export function parseRequestOption(option: RequestOption) {
  let config: RequestOption = {
    url: "",
    sendType: "normal",
    method: "GET",
    disableUrlCache: false,
    transmitPageParam: false,
    timeout: 30000,
  };
  config.sendType = config.sendType!.toLowerCase() as SendType;

  // 传递过来的参数覆盖默认值
  if (isPlainObject(option)) {
    config = {
      ...config,
      ...option,
    };
  }

  /**
   *  以下场景请求方法默认为POST
   * 1、调用方没有传递请求方法
   * 2、请求类型不为normal
   */
  if (!config.method && config.sendType !== "normal") {
    config.method = "POST";
  }

  // 如果没有设置headers，确保请求头为对象
  if (!config.headers) {
    config.headers = {};
  }

  // 生成请求的URL
  const url = buildUrlByOption(option);
  switch (config.sendType) {
    case "normal":
      config.body = null;
      break;
    case "text":
      if (typeof config.data === "string") {
        config.body = config.data;
      }
      break;
    case "form":
      if (isPlainObject(config.data)) {
        const body = new FormData();
        const data = config.data as Record<string, any>;
        for (let key in data) {
          body.append(key, data[key]);
        }
        config.body = body;
      } else if (config.data instanceof FormData) {
        config.body = config.data;
      }
      break;
    case "json":
      if (isPlainObject(config.data)) {
        (config.headers as Record<string, string>)["Content-Type"] = "application/json";
        config.body = JSON.stringify(config.data);
      }
      break;
    case "blob":
      if (config.data instanceof Blob) {
        config.body = config.data;
      }
      break;
    case "params":
      if (isPlainObject(config.data)) {
        const body = new URLSearchParams();
        const data = config.data as Record<string, any>;
        for (let key in data) {
          body.append(key, data[key]);
        }
        config.body = body;
      } else if (config.data instanceof URLSearchParams) {
        config.body = config.data;
      }
      break;
    case "buffer":
      if (
        isArrayBuffer(config.data) ||
        isTypedArray(config.data) ||
        config.data instanceof DataView
      ) {
        config.body = config.data as BodyInit;
      }
      break;
    default:
      break;
  }

  const fetchOption: RequestInit = omit(config, [
    "url",
    "sendType",
    "data",
    "disableUrlCache",
    "transmitPageParam",
    "timeout",
  ]);

  return { url, fetchOption, timeout: config.timeout ?? 30000 };
}

/**
 * 发送正常Ajax请求，这个函数带有超时逻辑
 * @param url
 * @param option
 */
export async function sendRequest<T = StandardAjaxResult>(option: RequestOption) {
  const { url, fetchOption, timeout } = parseRequestOption(option);
  return Promise.race([
    // 网络请求
    fetch(url, fetchOption)
      .then((response) => {
        return response.json();
      })
      .then((result: T) => {
        return result;
      })
      .catch(() => {
        const result: StandardAjaxResult = {
          code: -10000,
          message: "An exception occurred in the network request",
        };
        return result;
      }),
    // 超时逻辑
    new Promise<StandardAjaxResult>((resolve) => {
      window.setTimeout(() => {
        const result: StandardAjaxResult = {
          code: -10001,
          message: "Network request timeout",
        };
        resolve(result);
      }, timeout ?? 30000);
    }),
  ]);
}

/**
 * sendRequest方法的糖式调用
 * @param sendType
 * @param url
 * @param data
 * @param option
 * @returns
 */
export async function sugarSend<T = StandardAjaxResult>(
  sendType: SendType,
  url: string,
  data: SendDataType,
  option?: RequestOption
) {
  let config: RequestOption = {
    url,
    data,
    sendType,
  };
  if (isPlainObject(option)) {
    config = { ...config, ...omit(option, ["url", "data", "sendType"]) };
  }
  return sendRequest<T>(config);
}

/**
 * 简单直观的GET请求
 * @param url
 * @param data
 * @param option
 * @returns
 */
export async function GET<T = StandardAjaxResult>(
  url: string,
  data: SendDataType,
  option?: RequestOption
) {
  return sugarSend<T>("normal", url, data, option);
}

/**
 * 简单直观的POST请求
 * @param url
 * @param data
 * @param option
 * @returns
 */
export async function POST<T = StandardAjaxResult>(
  url: string,
  data: SendDataType,
  option?: RequestOption
) {
  return sugarSend<T>("form", url, data, option);
}

/**
 * 简单直观的发送json字符串
 * @param url
 * @param data
 * @param option
 * @returns
 */
export async function sendJSON<T = StandardAjaxResult>(
  url: string,
  data: SendDataType,
  option?: RequestOption
) {
  return sugarSend<T>("json", url, data, option);
}
