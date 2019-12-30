export interface LoadImageOption {
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
  sourceWidth?: number;
  sourceHeight?: number;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  contain?: boolean;
  cover?: boolean;
  aspectRatio?: number;
  pixelRatio?: number;
  downsamplingRatio?: number;
  crop?: number;
  orientation?: number | boolean;
  meta?: boolean;
  canvas?: boolean;
  crossOrigin?: string;
  noRevoke?: boolean;
}