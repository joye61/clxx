import { CascadeDataItem } from "./types";

export async function ensureDataSource(data?: Array<CascadeDataItem>) {
  if (Array.isArray(data)) {
    return data;
  }

  try {
    /**
     * 如果没有数据，默认取省市区数据
     */
    const defaultData = await import("./defaultData/index");

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
        const children =  dataSource[code].map(item => {
          const result: CascadeDataItem = {
            name: item.name,
            value: item.code
          };
          if (type === "city") {
            result.children = getChildrenFromSrouce(item.code, "district");
          }
          return result;
        });
        return children;
      } else {
        return [];
      }
    };

    return defaultData.province.map(item=>{
      const result: CascadeDataItem = {
        name: item.name,
        value: item.code,
        children: getChildrenFromSrouce(item.code, "city")
      };
      return result;
    })
  
  } catch (error) {
    return [];
  }
}
