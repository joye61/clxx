export interface AjaxOption {
  // 是否透传页面URL上的参数，默认否
  transmitParam?: boolean;
  // 是否不使用浏览器默认缓存，默认否
  noCache?: boolean;
  // 超时时间，默认30秒
  timeout?: number;
  // 超时时触发
  onTimeout?: () => void;
  // 发生异常时触发
  onError?: (error?: Error) => void;
}

interface RegenOption {
  url: string;
  transmitParam?: boolean;
  noCache?: boolean;
  data?: Record<string, any>;
}

/**
 * 重新生成url
 * @param url
 * @param transmitParam
 * @param data
 * @returns
 */
function regenUrl(option: RegenOption) {
  let url = option.url;
  // 防止url以 // 开头
  if (/^\/\//.test(url)) {
    url = window.location.protocol + url;
  }

  let params: Record<string, any> = {};
  if (option.data && typeof option.data === "object") {
    params = option.data;
  }

  // 如果不禁用浏览器缓存，则添加缓存参数
  if (option.noCache) {
    params.__c = Date.now().toString(36);
  }

  // 如果设置透传参数，则将页面URL的参数也传递
  if (option.transmitParam) {
    const base = new URL(window.location.href);
    base.searchParams.forEach((value, key) => {
      // 防止覆盖主动传递的参数
      if (!params[key]) {
        params[key] = value;
      }
    });
  }

  // 将最终参数拼装上去
  const urlObj = new URL(url);
  for (let key in params) {
    urlObj.searchParams.append(key, String(params[key]));
  }

  return url.toString();
}

/**
 * 获取结果，默认假设响应为json串
 * @param url
 * @param option
 * @returns
 */
function raceFetch<ResponseData = any>(
  url: string,
  option: AjaxOption & RequestInit
): Promise<ResponseData | void> {
  return Promise.race([
    // 请求逻辑
    fetch(url, option)
      .then((response) => {
        return response.json();
      })
      .then((result: ResponseData) => {
        return result;
      })
      .catch((error) => {
        option?.onError?.(error);
      }),

    // 超时逻辑
    new Promise<void>((resolve) => {
      window.setTimeout(() => {
        option?.onTimeout?.();
        resolve();
      }, option?.timeout || 30000);
    }),
  ]);
}

/**
 * 通过Get请求获取数据
 * @param url
 * @param data
 * @param option
 * @returns
 */
export async function GET<ResponseData = any>(
  url: string,
  data?: Record<string, any>,
  option?: AjaxOption & RequestInit
) {
  // 生成新的url
  url = regenUrl({
    url,
    noCache: option?.noCache ?? false,
    transmitParam: option?.transmitParam ?? false,
    data,
  });

  // 计算请求参数
  if (!option || typeof option !== "object") {
    option = {};
  }
  option.method = "GET";

  // 返回最终结果
  return raceFetch<ResponseData>(url, option);
}

/**
 * 发送post请求
 * @param url
 * @param data
 * @param option
 * @returns
 */
export async function POST<ResponseData = any>(
  url: string,
  data?: Record<string, any>,
  option?: AjaxOption & RequestInit
) {
  // 生成新的url
  url = regenUrl({
    url,
    noCache: option?.noCache ?? false,
    transmitParam: option?.transmitParam ?? false,
  });

  if (!option || typeof option !== "object") {
    option = {};
  }
  option.method = "POST";

  const form = new FormData();
  if (data && typeof data === "object") {
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        form.append(key, data[key]);
      }
    }
  }
  option.body = form;

  return raceFetch<ResponseData>(url, option);
}

/**
 * 发送原始JSON对象到远端
 * @param url 
 * @param data 
 * @param option 
 * @returns 
 */
export async function sendJSON<ResponseData = any>(
  url: string,
  data?: Record<string, any>,
  option?: AjaxOption & RequestInit
) {
  // 生成新的url
  url = regenUrl({
    url,
    noCache: option?.noCache ?? false,
    transmitParam: option?.transmitParam ?? false,
  });

  if (!option || typeof option !== "object") {
    option = {};
  }
  if (typeof option.headers !== "object") {
    option.headers = {};
  }
  (option.headers as Record<string, string>)["Content-Type"] =
    "application/json";
  option.method = "POST";
  option.body = JSON.stringify(data);

  return raceFetch<ResponseData>(url, option);
}
