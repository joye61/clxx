const UA = window.navigator.userAgent;

export type IsDefine = {
  android?: boolean;
  ios?: boolean;
  weixin?: boolean;
  qq?: boolean;
  iphoneX?: boolean;
};

export const is: IsDefine = {
  android: /Android/i.test(UA),
  ios: /iPhone|iPad/i.test(UA),
  weixin: /MicroMessenger/i.test(UA),
  qq: /QQ/i.test(UA),
  iphoneX: /iPhone/gi.test(UA) && window.screen.height >= 812
};
