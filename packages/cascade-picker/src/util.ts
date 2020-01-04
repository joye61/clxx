import { CascadeDataItem } from "./types";
import * as defaultData from "./defaultData/index";

/**
 * 确保数据源合法
 * @param data
 */
export function ensureDataSource(data?: Array<CascadeDataItem>) {
  if (Array.isArray(data)) {
    return data;
  }

  /**
   * 如果没有数据，默认取省市区数据
   */
  try {
    /**
     * 从数据源获取子列表
     * @param code
     * @param type
     */
    const getChildrenFromSrouce = (
      code: string,
      type: "city" | "district"
    ): Array<CascadeDataItem> => {
      const dataSource = defaultData[type];
      if (Array.isArray(dataSource[code])) {
        const children = dataSource[code].map(item => {
          const result: CascadeDataItem = {
            name: item.name,
            value: item.code
          };
          if (type === "city") {
            result.children = getChildrenFromSrouce(item.code, "district");
          } else {
            result.children = [];
          }
          return result;
        });
        return children;
      } else {
        return [];
      }
    };

    return defaultData.province.map(item => {
      const result: CascadeDataItem = {
        name: item.name,
        value: item.code,
        children: getChildrenFromSrouce(item.code, "city")
      };
      return result;
    });

  } catch (error) {
    return [];
  }
}

/**
 * 确保索引合法
 * @param value
 * @param list
 */
export function ensureValue(
  value: number[],
  list: Array<CascadeDataItem>
): number[] {
  if (!value || !Array.isArray(value)) {
    value = [];
  }
  let level = 0;
  let final: number[] = [];
  const ensureIndex = (list?: Array<CascadeDataItem>) => {
    if (!Array.isArray(list) || list.length === 0) {
      return;
    }
    let index: number = value[level];
    if (!index || !list[index]) {
      index = 0;
    }
    final.push(index);

    // 如果当前有子元素列表，继续增加
    if (list[index].children) {
      level++;
      ensureIndex(list[index].children);
    }
  };

  ensureIndex(list);
  return final;
}

/**
 * 根据改变生成新的列表
 * @param oldValue
 * @param changeIndex
 * @param index
 */
export function getNewValue(
  oldValue: number[],
  changeIndex: number,
  index: number
): number[] {
  const result: number[] = [];
  for (let i = 0; i < oldValue.length; i++) {
    if (i < changeIndex) {
      result.push(oldValue[i]);
    } else if (i === changeIndex) {
      result.push(index);
    } else {
      result.push(0);
    }
  }
  return result;
}

/**
 * 根据值获取列表
 * @param value
 * @param data
 */
export function getListByValue(
  value: number[],
  data: Array<CascadeDataItem>
): Array<CascadeDataItem[]> {
  // 拼装新的列表
  let result: Array<CascadeDataItem[]> = [];
  let tempList = data;
  for (let i = 0; i < value.length; i++) {
    result.push(tempList);
    tempList = tempList[value[i]].children! || [];
  }

  return result;
}

/**
 * 根据值获取结果
 * @param value
 * @param data
 */
export function getResultByValue(
  value: number[],
  data: Array<CascadeDataItem>
): Array<CascadeDataItem> {
  let result: Array<CascadeDataItem> = [];
  let tempList = data;
  for (let i = 0; i < value.length; i++) {
    result.push(tempList[value[i]]);
    tempList = tempList[value[i]].children! || [];
  }

  return result;
}
