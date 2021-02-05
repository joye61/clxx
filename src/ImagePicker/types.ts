export interface ImagePickList {
  // 原始的canvas对象
  canvas: HTMLCanvasElement;
  // 转换后的二进制
  blob: Blob;
  // 转换后的dataUrl
  dataUrl: string;
  // 图片的原始宽度
  originalWidth: number;
  // 图片的原始高度
  originalHeight: number;
}

export type RenderPickButton = (canPickMore?: boolean) => React.ReactNode;

// 每一轮选取的开始和结束Hook
export interface EachPickStartEndResult {
  onStartPick?: () => void;
  onEndPick?: () => void;
}

export interface ImagePickerOption {
  // 最大选取数量
  maxPick?: number;
  // 是否支持多选
  multiple?: boolean;
  // 选取的图片变化时触发
  onFilesChange?: (list?: Array<ImagePickList>) => void;
  // 选择区可定制
  renderPickButton?: RenderPickButton;
  // 每一轮各个阶段的钩子
  onHookEachRound?: () => EachPickStartEndResult;
}

export interface UseButtonOption extends ImagePickerOption {
  // single：简单选择器 | grid：位于网格中的选择器
  type: "single" | "grid";
}