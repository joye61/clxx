import { ControlsProps } from "@clxx/picker/build/Controls";

/**
 * 级联数据结构
 */
export type CascadeData = Array<CascadeDataItem>;
export type CascadeDataItem = {
  content: React.ReactElement | string;
  value: any;
  children?: CascadeData;
};

export interface CascadeProps extends ControlsProps {
  /**
   * 传递的数据
   */
  data?: CascadeData;
  /**
   * 默认被选中的索引
   */
  defaultSelected?: Array<number>;
}
