let JSONP_INDEX = 1;
declare const window: Window & {
  [key: string]: any;
};
/**
 * 发送jsonp请求
 * @param url
 * @param callbackName
 */
export async function jsonp(
  url: string,
  callbackName: string = 'callback',
): Promise<any> {
  return new Promise((resolve, reject) => {
    // 生成全局唯一的
    JSONP_INDEX += 1;
    const funcName = 'jsonp_' + Date.now().toString(36) + '_' + JSONP_INDEX;

    // 修正以//开头的链接，添加跟location相同的schema
    if (/^\/\//.test(url)) {
      url = window.location.protocol + url;
    }
    const urlObject = new URL(url);
    urlObject.searchParams.set(callbackName, funcName);

    // 清理辅助函数
    const cleanup = () => {
      delete window[funcName];
      script.remove();
    };

    // 创建全局script
    const script = document.createElement('script');
    script.src = urlObject.href;
    document.body.appendChild(script);
    script.onerror = (error) => {
      cleanup();
      reject(error);
    };

    // 创建全局函数
    window[funcName] = (result: any) => {
      cleanup();
      resolve(result);
    };
  });
}
