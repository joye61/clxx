import cookie from "./cookie";

/**
 * 简单检测逻辑
 */

const is = {
  android: false,
  ios: false,
  weixin: false,
  qq: false,
  chelun: false,
  chelunLogin: false
};

export default is;

const ua = window.navigator.userAgent;

if (/iPhone|iPad/i.test(ua)) {
  is.ios = true;
}

if (/Android/i.test(ua)) {
  is.android = true;
}

if (/MicroMessenger/i.test(ua)) {
  is.weixin = true;
}

if (/QQ/i.test(ua)) {
  is.qq = true;
}

// 车轮域名下检测逻辑
if (/chelun\.com|eclick\.cn/.test(window.location.host)) {
  const cookies = cookie.all();

  if (cookies["chelun_appName"]) {
    is.chelun = true;
  }

  let isLogin = cookies["chelun_isLogin"];
  if (!isLogin) {
    isLogin = "false";
  }
  is.chelunLogin = isLogin === "false" ? false : true;
}
