import { ControlsProps } from "@clxx/picker/build/Controls";

export interface CascadeDataItem {
  /**
   * 显示名字
   */
  name: string;
  /**
   * 每一条目所代表的值
   */
  value: any;
  /**
   * 级联子列表
   */
  children?: Array<CascadeDataItem>;
}

export interface CascadeResult {
  /**
   * 级联索引数组
   */
  index: Array<number>;
  /**
   * 级联索引的值
   */
  value: Array<CascadeDataItem>;
}

export interface CascadeProps extends ControlsProps {
  /**
   * 控制区可显示标题
   */
  title?: React.ReactNode;
  /**
   * 数据源，如果不传递值则显示默认省市区数据
   */
  data?: Array<CascadeDataItem>;
  /**
   * 默认值的级联索引
   */
  defaultValue?: number[];
  /**
   * 确认点击时显示
   */
  onConfirm?: any & ((result: CascadeResult) => void);
}

export interface CascadePickerProps extends CascadeProps {
  children?: React.ReactNode;
  renderResult?: (result: CascadeResult) => React.ReactNode;
}
