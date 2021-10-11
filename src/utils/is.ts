/**
 * 一些常用的简单环境判断
 * @param env
 * @returns
 */
export function is(
  env:
    | "ios" // ios平台
    | "android" // android平台
    | "wechat" // 微信环境
    | "qq" // QQ环境
    | "alipay" // 支付宝环境
    | "weibo" // 微博环境
    | "douyin" // 抖音环境
    | "touchable" // 可触摸环境
) {
  const ua = window.navigator.userAgent;
  switch (env.toLowerCase()) {
    case "ios":
      return /iPhone|iPad/i.test(ua);
    case "android":
      return /Android/i.test(ua);
    case "wechat":
      return /MicroMessenger/i.test(ua);
    case "qq":
      return /QQ/i.test(ua);
    case "alipay":
      return /AlipayClient/i.test(ua);
    case "weibo":
      return /Weibo/i.test(ua);
    case "douyin":
      return /aweme/i.test(ua);
    case "touchable":
      return window.ontouchstart !== undefined;
    default:
      return false;
  }
}
