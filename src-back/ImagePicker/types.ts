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
  // loadImage库的选项
  loadImageOption?: LoadImageOption;
}

export interface UseButtonOption extends ImagePickerOption {
  // single：简单选择器 | grid：位于网格中的选择器
  type: "single" | "grid";
}

// https://github.com/blueimp/JavaScript-Load-Image#options
export interface LoadImageOption {
  maxWidth: number;
  maxHeight: number;
  minWidth: number;
  minHeight: number;
  sourceWidth: number;
  sourceHeight: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
  contain: boolean;
  cover: boolean;
  aspectRatio: number;
  pixelRatio: number;
  downsamplingRatio: number;
  imageSmoothingEnabled: boolean;
  imageSmoothingQuality: string;
  crop: boolean;
  orientation: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | true;
  meta: boolean;
  canvas: boolean;
  crossOrigin: boolean;
  noRevoke: boolean;
}
