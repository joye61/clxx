/**
 * 环境类型定义
 */
export type EnvType =
  | "ios" // iOS 平台（iPhone/iPad/iPod）
  | "android" // Android 平台
  | "wechat" // 微信环境
  | "qq" // QQ/QQ浏览器
  | "alipay" // 支付宝环境
  | "weibo" // 微博环境
  | "douyin" // 抖音环境
  | "xiaohongshu" // 小红书
  | "toutiao" // 今日头条
  | "baidu" // 百度 APP
  | "touchable"; // 可触摸环境

// 缓存 UserAgent，避免重复获取
const UA = window.navigator.userAgent;

// 预编译正则表达式，提升性能
const REGEX_PATTERNS = {
  ios: /iPhone|iPad|iPod/i,
  // iPadOS 13+ 会显示为 Mac，需要通过 maxTouchPoints 判断
  ipad: /Macintosh/i,
  android: /Android/i,
  wechat: /MicroMessenger/i,
  // QQ 有多种形式：手Q、QQ浏览器等
  qq: /\s(QQ|MQQBrowser)\//i,
  alipay: /AlipayClient/i,
  weibo: /Weibo/i,
  douyin: /aweme/i,
  xiaohongshu: /xhsdiscover/i,
  toutiao: /NewsArticle/i,
  baidu: /baiduboxapp/i,
} as const;

// 结果缓存，避免重复判断
const cache = new Map<EnvType, boolean>();

/**
 * 判断是否为触摸设备
 * 综合多种方式判断，提高准确性
 */
function isTouchable(): boolean {
  // 1. 检查是否支持触摸事件
  const hasTouchEvent = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // 2. 检查是否为移动设备 UA
  const isMobileUA = /Mobile|Android|iPhone|iPad|iPod/i.test(UA);
  
  // 3. 综合判断
  return hasTouchEvent && isMobileUA;
}

/**
 * 判断是否为 iPad（包括 iPadOS 13+ 伪装成 Mac 的情况）
 */
function isIPad(): boolean {
  // iPadOS 13+ 显示为 Mac，但有触摸点
  if (REGEX_PATTERNS.ipad.test(UA) && navigator.maxTouchPoints > 1) {
    return true;
  }
  return /iPad/i.test(UA);
}

/**
 * 常用的简单环境判断
 * @param env 环境类型
 * @returns 是否匹配该环境
 * 
 * @example
 * ```typescript
 * if (is('ios')) {
 *   // iOS 特定逻辑
 * }
 * 
 * if (is('wechat')) {
 *   // 微信内逻辑
 * }
 * ```
 */
export function is(env: EnvType): boolean {
  // 从缓存中获取结果
  if (cache.has(env)) {
    return cache.get(env)!;
  }

  let result = false;

  switch (env.toLowerCase()) {
    case "ios":
      result = REGEX_PATTERNS.ios.test(UA) || isIPad();
      break;
    case "android":
      result = REGEX_PATTERNS.android.test(UA);
      break;
    case "wechat":
      result = REGEX_PATTERNS.wechat.test(UA);
      break;
    case "qq":
      result = REGEX_PATTERNS.qq.test(UA);
      break;
    case "alipay":
      result = REGEX_PATTERNS.alipay.test(UA);
      break;
    case "weibo":
      result = REGEX_PATTERNS.weibo.test(UA);
      break;
    case "douyin":
      result = REGEX_PATTERNS.douyin.test(UA);
      break;
    case "xiaohongshu":
      result = REGEX_PATTERNS.xiaohongshu.test(UA);
      break;
    case "toutiao":
      result = REGEX_PATTERNS.toutiao.test(UA);
      break;
    case "baidu":
      result = REGEX_PATTERNS.baidu.test(UA);
      break;
    case "touchable":
      result = isTouchable();
      break;
    default:
      result = false;
  }

  // 缓存结果
  cache.set(env, result);
  return result;
}

/**
 * 清除缓存（用于测试或特殊场景）
 */
export function clearIsCache(): void {
  cache.clear();
}
