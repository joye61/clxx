import {is} from "../is";

test("check is value", ()=>{
  const isAndroid = jest.fn(is.android);
  const isIOS = jest.fn(is.ios);
  const isWeixin = jest.fn(is.weixin);
  const isQQ = jest.fn(is.QQ);
  const isIphoneX = jest.fn(is.iphoneX);

  expect(isAndroid()).toBeFalsy();
  expect(isIOS()).toBeFalsy();
  expect(isWeixin()).toBeFalsy();
  expect(isQQ()).toBeFalsy();
  expect(isIphoneX()).toBeFalsy();
})