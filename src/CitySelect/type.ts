export interface CityData {
  // key为拼音首字母相同的城市的拼音首字母（只能为26个字母之一），大写格式
  [key: string]: Array<{
    // 城市拼音，全拼,如:shanghai
    pinyin: string;
    // 拼音简写，如:湖北对应hb
    pinyinShort: string;
    // 城市名称
    name: string;
    // 城市代码
    code: string;
    // 省份代码
    pcode: string;
  }>;
}

export interface ProvinceData {
  // code为省份代码
  [code: string]: {
    // 省份拼音，全拼，如：hubei
    pinyin: string;
    // 拼音简写，如:湖北对应hb
    pinyinShort: string;
    // 省份名称
    name: string;
  };
}

export type CityItem = CityData[string][number];