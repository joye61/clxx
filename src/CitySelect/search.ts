import { cityData } from "./data";
import type { CityItem } from "./type";

/**
 * 城市搜索：根据输入的关键词前缀匹配 pinyin / pinyinShort / name 字段
 * - 输入为空返回空数组
 * - 英文字母不区分大小写
 * - 使用首字符索引，避免遍历全部城市，保持 O(k) 级别的候选规模
 */
const __allCities: CityItem[] = Object.keys(cityData)
  .sort()
  .flatMap((k) => cityData[k]);

// 按首字符建立索引：同一个城市的 pinyin、pinyinShort、name 首字符分别入桶
const __cityIndex: Map<string, CityItem[]> = (() => {
  const map = new Map<string, CityItem[]>();
  const put = (key: string, item: CityItem) => {
    if (!key) return;
    let arr = map.get(key);
    if (!arr) {
      arr = [];
      map.set(key, arr);
    }
    // 同一 key 下去重（同一城市多字段首字符相同时只入一次）
    if (arr[arr.length - 1] !== item) arr.push(item);
  };
  for (const item of __allCities) {
    put(item.pinyin[0], item);
    put(item.pinyinShort[0], item);
    put(item.name[0], item);
  }
  return map;
})();

export function searchCity(keyword: string): CityItem[] {
  if (!keyword) return [];
  const kw = keyword.trim();
  if (!kw) return [];
  const first = kw[0];
  // 英文按小写匹配 pinyin / pinyinShort；中文按原字符匹配 name
  const isAscii = first.charCodeAt(0) < 128;
  const lookupKey = isAscii ? first.toLowerCase() : first;
  const candidates = __cityIndex.get(lookupKey);
  if (!candidates) return [];
  if (isAscii) {
    const lower = kw.toLowerCase();
    const seen = new Set<CityItem>();
    const out: CityItem[] = [];
    for (const item of candidates) {
      if (seen.has(item)) continue;
      if (item.pinyin.startsWith(lower) || item.pinyinShort.startsWith(lower)) {
        seen.add(item);
        out.push(item);
      }
    }
    return out;
  }
  // 中文前缀匹配 name
  const out: CityItem[] = [];
  for (const item of candidates) {
    if (item.name.startsWith(kw)) out.push(item);
  }
  return out;
}
