import { ControlsProps } from "@clxx/picker/build/Controls";

export interface CascadeDataItem {
  name: string;
  value: any;
  children?: Array<CascadeDataItem>;
}

export interface CascadeProps {
  data?: Array<CascadeDataItem>;
  defaultValue?: number[];
}
