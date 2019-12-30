/** @jsx jsx */
import { jsx } from "@emotion/core";
import loadImage from "./loadImage";
import { AutoGrid, AutoGridProps } from "@clxx/layout/build/AutoGrid";
import { ColCenter } from "@clxx/layout/build/Col";
import { style } from "./style";
import { useRef, ChangeEvent } from "react";
import { LoadImageOption } from "./loadImageOption";

export interface ImagePickerProps extends AutoGridProps, LoadImageOption {
  maxPick?: number;
  pickHint?: string;
  multiple?: boolean;
}

export function ImagePicker(props: ImagePickerProps) {
  const {
    col = 4,
    gap = 10,
    maxPick = 9,
    multiple = false,
    autoHeight = false,
    pickHint = "上传照片",
    ...loadImageOption
  } = props;

  const file = useRef<HTMLInputElement>(null);
  const onPickerClick = () => {
    file.current?.click();
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files instanceof FileList) {
      /**
       * 从本地异步载入一张图片文件
       * @param file
       */
      const load = async (file: File) => {
        let option: LoadImageOption = {
          orientation: true,
          canvas: true,
          ...loadImageOption
        };
        return new Promise((resolve, reject) => {
          loadImage(
            file,
            (result: any) => {
              if (result.type === "error") {
                reject();
              } else {
                console.log(1111, result);
                resolve(result);
              }
            },
            option
          );
        });
      };

      /**
       * 加载所有图片的列表
       */
      (async () => {
        for (let i = 0; i < files.length; i++) {
          await load(files[i]);
        }
      })();
    }
  };

  return (
    <div>
      <AutoGrid col={col} gap={gap} autoHeight={autoHeight}>
        <ColCenter
          css={style.pick}
          onTouchStart={() => {}}
          onClick={onPickerClick}
        >
          <svg viewBox="0 0 1024 1024">
            <path d="M712.5 788.8H194.2c-22.5 0-43-8.8-58.7-23.3l146.9-183.2c7.9-9.8 19-15.5 31.2-15.9 12.2-0.4 23.6 4.6 32 13.9l12.9 14.3c17.1 19 41 28.8 65.8 27.1 24.7-1.7 47.2-14.9 61.8-36L560.2 478c8-11.7 20.5-18.4 34.1-18.5h0.3c13.6 0 26 6.6 34.1 18.1l76.7 108.9c6.8 9.6 19.6 11.5 28.6 4.3 8.9-7.1 10.7-20.4 4-29.9L661.3 452c-15.9-22.5-40.1-35.4-66.7-35.4h-0.5c-26.8 0.2-51.1 13.4-66.8 36.2l-74.1 107.8c-7.4 10.8-18.9 17.5-31.6 18.4-12.6 0.9-24.9-4.2-33.6-13.8l-12.9-14.3c-16.2-18-39.1-28-62.7-27.3-23.6 0.7-45.8 12-61.1 31l-140 174.7c-4-10.7-6.3-22.5-6.3-34.7V328.9c0-52 40-94.2 89.2-94.2H767c49.3 0 89.2 42.2 89.2 94.2v181.3c0 11.9 9.1 21.5 20.3 21.5s20.3-9.6 20.3-21.5V328.9c0-75.7-58.2-137.1-129.9-137.1H194.2c-71.7 0-129.9 61.4-129.9 137.1v365.7c0 75.7 58.2 137.1 129.9 137.1h518.3c11.2 0 20.3-9.6 20.3-21.5 0-11.8-9.1-21.4-20.3-21.4z" />
            <path d="M926.6 672.7h-52.5v-54.5c0-19.4-14.9-35.1-33.2-35.1s-33.2 15.7-33.2 35.1v54.5h-53.6c-18.3 0-33.2 15.7-33.2 35.1 0 19.4 14.9 35.1 33.2 35.1h53.6v53.9c0 19.4 14.9 35.1 33.2 35.1s33.2-15.7 33.2-35.1v-53.9h52.5c18.3 0 33.2-15.7 33.2-35.1 0-19.4-14.9-35.1-33.2-35.1zM256.5 416.1c-35 0-63.6-28.5-63.6-63.6 0-35 28.5-63.6 63.6-63.6s63.6 28.5 63.6 63.6-28.6 63.6-63.6 63.6z m0-89.2c-14.1 0-25.6 11.5-25.6 25.6 0 14.1 11.5 25.6 25.6 25.6 14.1 0 25.6-11.5 25.6-25.6 0-14.1-11.5-25.6-25.6-25.6z" />
          </svg>
          <span>{pickHint}</span>
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            ref={file}
            onChange={onChange}
          />
        </ColCenter>
      </AutoGrid>
    </div>
  );
}
