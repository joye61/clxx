/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useRef, useState } from "react";
import { ImagePickList } from ".";

export interface SimpleImagePickerOption {
  // 最大选取数量
  maxPick?: number;
  // 是否支持多选
  multiple?: boolean;
  // 选取的图片变化时触发
  onFilesChange?: (list?: Array<ImagePickList>) => void;
  // 选择区可定制
  renderPickButton?: (disabled: boolean) => React.ReactNode;
}

export function SimpleImagePicker(props: SimpleImagePickerOption) {}
