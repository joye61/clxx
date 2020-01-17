/** @jsx jsx */
import { jsx, SerializedStyles, ObjectInterpolation } from "@emotion/core";
import loadImage from "./loadImage";
import { Grid, GridProps } from "@clxx/layout/build/Grid";
import { ColCenter } from "@clxx/layout/build/Col";
import { style } from "./style";
import { useRef, ChangeEvent, useState, useEffect } from "react";
import { LoadImageOption } from "./LoadImageOption";

export interface PickedList {
  file: File;
  canvas: HTMLCanvasElement;
  dataURL: string;
}

export interface ImagePickerProps extends GridProps, LoadImageOption {
  /**
   * 最大选取图片数
   */
  maxPick?: number;
  /**
   * 选取按钮文字提示
   */
  pickHint?: string;
  /**
   * 正在选取文字提示
   */
  pickingHint?: string;
  /**
   * 是否支持多选
   */
  multiple?: boolean;
  /**
   * 是否显示选取缩略图
   */
  showPickedThumb?: boolean;
  /**
   * 列表变化时触发，list对象可用户上传
   */
  onChange?: ((list: PickedList) => void) | any;
}

export function ImagePicker(props: ImagePickerProps) {
  let {
    column = 4,
    gap = 10,
    maxPick = 9,
    multiple = false,
    square = true,
    pickHint = "选取照片",
    pickingHint = "正在选取",
    showPickedThumb = true,
    onChange,
    ...loadImageOption
  } = props;

  // 不显示缩略图的时候选取数量不受限制
  if (!showPickedThumb) {
    maxPick = Number.MAX_SAFE_INTEGER;
  }

  /**
   * 当前选择的图片列表
   */
  const [list, setList] = useState<PickedList[]>([]);
  /**
   * 是否正在选择图片
   */
  const [isPick, setIsPick] = useState<boolean>(false);

  /**
   * 文件选择器的引用
   */
  const file = useRef<HTMLInputElement>(null);
  const onPickerClick = () => {
    file.current?.click();
  };

  /**
   * 响应文件选择事件
   * @param event
   */
  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.persist();
    const files = event.target.files;
    if (files instanceof FileList) {
      /**
       * 从本地异步载入一张图片文件
       * @param file
       */
      const load = async (file: File): Promise<HTMLCanvasElement> => {
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
        setIsPick(true);
        const pickedList: PickedList[] = [];
        for (let i = 0; i < files.length; i++) {
          try {
            const canvas = await load(files[i]);
            pickedList.push({
              file: files[i],
              canvas,
              dataURL: canvas.toDataURL()
            });
            // eslint-disable-next-line no-empty
          } catch (error) {}
        }

        let finalList: Array<PickedList> = [];
        if (showPickedThumb) {
          finalList = [...list, ...pickedList];
          finalList.splice(maxPick);
        } else {
          finalList = pickedList;
        }
        setList(finalList);
        // 清除被选择的文件列表
        event.target.value = "";
      })();
    }
  };

  /**
   * 列表变化时会触发的逻辑
   */
  useEffect(() => {
    // 只要list有变化，肯定变成可选状态
    setIsPick(false);

    // 每次列表变化都会触发onChange事件
    onChange?.(list);
  }, [list]);

  /**
   * 按钮的一些状态参数
   */
  let pickStyle: SerializedStyles = style.canPick;
  let hint = pickHint;
  let pickClick: undefined | (() => void) = onPickerClick;

  /**
   * 当前正在选取照片，按钮灰显
   */
  if (isPick) {
    pickStyle = style.cantPick;
    hint = pickingHint;
    pickClick = undefined;
  }

  /**
   * 照片选取到达上限之后，按钮灰显
   */
  if (list.length >= maxPick) {
    pickStyle = style.cantPick;
    hint = `上限${maxPick}张`;
    pickClick = undefined;
  }

  return (
    <Grid
      column={column}
      gap={gap}
      square={square}
      className="clxx-ImagePicker"
    >
      {/* 已经选取的图片列表 */}
      {showPickedThumb
        ? list.map((item, index) => {
            const autoStyle: ObjectInterpolation<any> = {};
            if (item.canvas.width > item.canvas.height) {
              autoStyle.height = "100%";
            } else {
              autoStyle.width = "100%";
            }
            return (
              <div
                key={index}
                css={style.item}
                className="clxx-ImagePicker-item"
              >
                <img css={autoStyle} src={item.dataURL} alt={item.file.name} />
                <ColCenter
                  css={style.remove}
                  onTouchStart={() => undefined}
                  onClick={() => {
                    list.splice(index, 1);
                    setList([...list]);
                  }}
                  className="clxx-ImagePicker-remove"
                >
                  <svg viewBox="0 0 1024 1024">
                    <path d="M384 853.333333c12.8 0 21.333333-10.666667 21.333333-21.333333l-32-512c0-12.8-10.666667-21.333333-21.333333-21.333333-12.8 0-21.333333 10.666667-21.333333 21.333333L362.666667 832C362.666667 844.8 373.333333 853.333333 384 853.333333zM874.666667 170.666667 661.333333 170.666667 661.333333 85.333333c0-23.466667-19.2-42.666667-42.666667-42.666667L405.333333 42.666667c-23.466667 0-42.666667 19.2-42.666667 42.666667l0 85.333333L149.333333 170.666667C136.533333 170.666667 128 179.2 128 192c0 12.8 8.533333 21.333333 21.333333 21.333333l42.666667 0 42.666667 682.666667c6.4 46.933333 38.4 85.333333 85.333333 85.333333l384 0c46.933333 0 76.8-38.4 85.333333-85.333333l42.666667-682.666667 42.666667 0c12.8 0 21.333333-8.533333 21.333333-21.333333C896 179.2 887.466667 170.666667 874.666667 170.666667zM405.333333 85.333333l213.333333 0 0 85.333333L405.333333 170.666667 405.333333 85.333333zM746.666667 896c-2.133333 23.466667-19.2 42.666667-42.666667 42.666667L320 938.666667c-23.466667 0-38.4-19.2-42.666667-42.666667l-42.666667-682.666667 554.666667 0L746.666667 896zM640 853.333333c12.8 0 21.333333-8.533333 21.333333-21.333333l32-512c0-12.8-8.533333-21.333333-21.333333-21.333333-12.8 0-21.333333 8.533333-21.333333 21.333333L618.666667 832C618.666667 842.666667 627.2 853.333333 640 853.333333zM512 853.333333c12.8 0 21.333333-8.533333 21.333333-21.333333L533.333333 320c0-12.8-8.533333-21.333333-21.333333-21.333333s-21.333333 8.533333-21.333333 21.333333l0 512C490.666667 844.8 499.2 853.333333 512 853.333333z" />
                  </svg>
                </ColCenter>
              </div>
            );
          })
        : null}

      {/* 选取图片按钮 */}
      <ColCenter
        css={[style.pick, pickStyle]}
        onTouchStart={() => undefined}
        onClick={pickClick}
        className="clxx-ImagePicker-btn"
      >
        <svg viewBox="0 0 1024 1024">
          <path d="M712.5 788.8H194.2c-22.5 0-43-8.8-58.7-23.3l146.9-183.2c7.9-9.8 19-15.5 31.2-15.9 12.2-0.4 23.6 4.6 32 13.9l12.9 14.3c17.1 19 41 28.8 65.8 27.1 24.7-1.7 47.2-14.9 61.8-36L560.2 478c8-11.7 20.5-18.4 34.1-18.5h0.3c13.6 0 26 6.6 34.1 18.1l76.7 108.9c6.8 9.6 19.6 11.5 28.6 4.3 8.9-7.1 10.7-20.4 4-29.9L661.3 452c-15.9-22.5-40.1-35.4-66.7-35.4h-0.5c-26.8 0.2-51.1 13.4-66.8 36.2l-74.1 107.8c-7.4 10.8-18.9 17.5-31.6 18.4-12.6 0.9-24.9-4.2-33.6-13.8l-12.9-14.3c-16.2-18-39.1-28-62.7-27.3-23.6 0.7-45.8 12-61.1 31l-140 174.7c-4-10.7-6.3-22.5-6.3-34.7V328.9c0-52 40-94.2 89.2-94.2H767c49.3 0 89.2 42.2 89.2 94.2v181.3c0 11.9 9.1 21.5 20.3 21.5s20.3-9.6 20.3-21.5V328.9c0-75.7-58.2-137.1-129.9-137.1H194.2c-71.7 0-129.9 61.4-129.9 137.1v365.7c0 75.7 58.2 137.1 129.9 137.1h518.3c11.2 0 20.3-9.6 20.3-21.5 0-11.8-9.1-21.4-20.3-21.4z" />
          <path d="M926.6 672.7h-52.5v-54.5c0-19.4-14.9-35.1-33.2-35.1s-33.2 15.7-33.2 35.1v54.5h-53.6c-18.3 0-33.2 15.7-33.2 35.1 0 19.4 14.9 35.1 33.2 35.1h53.6v53.9c0 19.4 14.9 35.1 33.2 35.1s33.2-15.7 33.2-35.1v-53.9h52.5c18.3 0 33.2-15.7 33.2-35.1 0-19.4-14.9-35.1-33.2-35.1zM256.5 416.1c-35 0-63.6-28.5-63.6-63.6 0-35 28.5-63.6 63.6-63.6s63.6 28.5 63.6 63.6-28.6 63.6-63.6 63.6z m0-89.2c-14.1 0-25.6 11.5-25.6 25.6 0 14.1 11.5 25.6 25.6 25.6 14.1 0 25.6-11.5 25.6-25.6 0-14.1-11.5-25.6-25.6-25.6z" />
        </svg>
        <span>{hint}</span>
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          ref={file}
          onChange={onInputChange}
        />
      </ColCenter>
    </Grid>
  );
}
