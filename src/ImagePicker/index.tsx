/** @jsx jsx */
import { Interpolation, jsx, Theme } from "@emotion/react";
import React, { useEffect, useRef, useState } from "react";
import { AutoGrid, AutoGridOption } from "../AutoGrid";
import { Clickable } from "../Clickable";
import { RowCenter } from "../Layout/Flex";
import { IconCamera, IconDelete } from "./icons";
import loadImage from "./loadImage";
import { style } from "./style";
import { toBlobPolyfill } from "./toBlobPolyfill";

export interface ImagePickList {
  // 原始的canvas对象
  canvas: HTMLCanvasElement;
  // 转换后的二进制
  blob: Blob;
  // 转换后的dataUrl
  dataUrl: string;
}

// 每一轮选择的开始和结束选取
export interface EachPickStartEndResult {
  onStartPick?: () => void;
  onEndPick?: () => void;
}

export interface ImagePickerOption extends AutoGridOption {
  // 最大选取数量
  maxPick?: number;
  // 是否支持多选
  multiple?: boolean;
  // 选取的图片变化时触发
  onFilesChange?: (list?: Array<ImagePickList>) => void;
  // 选择区可定制
  renderPickButton?: (disabled: boolean) => React.ReactNode;
  // 每一轮各个阶段的钩子
  onHookEachRound?: () => EachPickStartEndResult;
}

export function ImagePicker(props: ImagePickerOption) {
  const {
    maxPick = 10,
    multiple = false,
    onFilesChange,
    cols = 4,
    gutter = 10,
    isSquare = true,
    renderPickButton,
    onHookEachRound,
    ...autoGridProps
  } = props;

  const [list, setList] = useState<Array<ImagePickList>>([]);
  const file = useRef<HTMLInputElement | null>(null);

  // 获取所有的钩子
  const hooks = onHookEachRound?.();

  // toBlob兼容
  useEffect(toBlobPolyfill, []);

  // 获取文件变更通知
  useEffect(() => {
    // 触发文件更新事件，暴露给第三方
    onFilesChange?.(list);
  }, [list, onFilesChange]);

  // 文件选取改变时触发
  const onInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // 调用可能存在的开始钩子
    await hooks?.onStartPick?.();

    // 如果没有任何图片，什么都不做
    const len = event.target.files?.length;
    if (!len) {
      return;
    }
    const rawList = [...list];
    // 读取所有图片到组件存储中
    for (let i = 0; i < len; i++) {
      try {
        // 获取结果
        const result: any = await loadImage(event.target.files![i], {
          orientation: true,
          canvas: true,
        });
        // 转换为blob
        const blob = await new Promise<Blob>((resolve) => {
          (result.image as HTMLCanvasElement).toBlob((bin) => {
            resolve(bin!);
          });
        });

        // 未超过最大选取限制时，可以添加
        if (rawList.length < maxPick) {
          rawList.push({
            canvas: result.image,
            blob,
            dataUrl: result.image.toDataURL()
          });
        }
      } catch (error) {}

      // 如果列表超过限制，退出循环
      if (rawList.length >= maxPick) {
        break;
      }
    }

    // 更新列表
    setList([...rawList]);
    // 清理选中的图片
    event.target.value = "";

    // 调用可能存在的结束钩子
    await hooks?.onEndPick?.();
  };

  /**
   * 渲染选取按钮
   */
  const renderButton = () => {
    // 按钮是否已经失效，超过选取限制就失效（不能再选了）
    const disabled = list.length >= maxPick;
    // 判断是否有自定义的渲染按钮
    const hasCustomButton = typeof renderPickButton === "function";

    // 获取渲染内容
    const content = hasCustomButton ? renderPickButton!(disabled) : IconCamera;

    // 最终样式
    const finalCss: Interpolation<Theme> = [style.btn];

    // 如果采用默认按钮，则采用默认样式
    if (!hasCustomButton) {
      if (disabled) {
        finalCss.push(style.defaultBtnDisable);
      } else {
        finalCss.push(style.defaultBtn);
      }
    }

    // 输出最终渲染结果
    if (disabled) {
      return <div css={finalCss}>{content}</div>;
    } else {
      return (
        <Clickable
          css={finalCss}
          onClick={() => {
            // 点击触发图片选择
            file.current?.click();
          }}
        >
          {content}
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            ref={file}
            onChange={onInputChange}
          />
        </Clickable>
      );
    }
  };

  /**
   * 点击删除元素时触发
   * @param index
   */
  const onRemoveItem = (index: number) => {
    if (!list[index]) {
      return;
    }
    list.splice(index, 1);
    setList([...list]);
  };

  /**
   * 显示小图片预览列表
   */
  const showPreviewList = () => {
    return list.map((item, index) => {
      return (
        <div css={style.preview} key={item.dataUrl}>
          <img alt="" src={item.dataUrl} />
          {/* 删除按钮 */}
          <RowCenter css={style.deleteBtn}>
            <Clickable onClick={() => onRemoveItem(index)}>
              {IconDelete}
            </Clickable>
          </RowCenter>
        </div>
      );
    });
  };

  return (
    <AutoGrid
      {...autoGridProps}
      cols={cols}
      gutter={gutter as any}
      isSquare={isSquare}
    >
      {/* 显示预览图 */}
      {showPreviewList()}
      {/* 第一个元素是选取框 */}
      {renderButton()}
    </AutoGrid>
  );
}
