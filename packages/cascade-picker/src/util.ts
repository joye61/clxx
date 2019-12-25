import { CascadeData, CascadeDataItem } from "./types";

/**
 * 获取级联的级数
 * @param data
 */
export function getLevel(data: CascadeData) {
  let level = 0;
  if (!Array.isArray(data) || data.length === 0) {
    return level;
  }

  let list: CascadeData | undefined = data;
  while (Array.isArray(list)) {
    level++;
    list = list[0].children;
  }

  return level;
}

/**
 * 根据当前选择项获取数据列表
 * @param data
 * @param selected
 */
export function getListBySelected(data: CascadeData, selected: Array<number>) {
  function getPickerListByKey(
    key: keyof CascadeDataItem,
    array: CascadeData
  ): Array<React.ReactElement | string> {
    return array.map(item => {
      return item[key];
    });
  }

  let list: Array<React.ReactElement | string>[] = [];

  // 获取元素列表
  let tempList: CascadeData = data;

  // 最后一个元素没有列表，不获取
  for (let index = 0; index < selected.length; index++) {
    list.push(getPickerListByKey("content", tempList));
    tempList = tempList[selected[index]]?.children ?? [];
  }

  return list;
}
