// 设计通用字体栈（与 iOS / 桌面/ 中文常见系统字体兼容）
export const fontStack =
  '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';

// 数字场景优先使用 SF Pro Text（iOS），其它退化到通用字体栈
export const numberFontStack = `"SF Pro Text", ${fontStack}`;
