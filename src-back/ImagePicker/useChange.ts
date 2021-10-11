import { useEffect, useState } from "react";
import loadImage from "./loadImage";
import { toBlobPolyfill } from "./toBlobPolyfill";
import {
  EachPickStartEndResult,
  ImagePickList,
  LoadImageOption,
} from "./types";

export interface UseOnChangeReturn<T> {
  // 返回最新的列表
  list: ImagePickList[];
  // 改变回调
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<T>;
  // 删除回调
  onRemove: (index: number) => void;
}

export interface UseOnChangeOption {
  maxPick: number;
  onHookEachRound?: () => EachPickStartEndResult;
  onFilesChange?: (list?: Array<ImagePickList>) => void;
  type: "grid" | "single";
  loadImageOption?: LoadImageOption;
}

export function useOnChange({
  maxPick = 10,
  onHookEachRound,
  onFilesChange,
  type,
  loadImageOption,
}: UseOnChangeOption): UseOnChangeReturn<void> {
  // 获取所有的钩子
  const hooks = onHookEachRound?.();

  // 已选取的文件列表
  const [list, setList] = useState<Array<ImagePickList>>([]);

  // toBlob兼容
  useEffect(toBlobPolyfill, []);

  // 获取文件变更通知
  useEffect(() => {
    // 触发文件更新事件，暴露给第三方
    onFilesChange?.(list);
  }, [list, onFilesChange]);

  // 删除一个元素
  const onRemove = (index: number) => {
    if (!list[index]) {
      return;
    }
    list.splice(index, 1);
    setList([...list]);
  };

  // 变化时的回调
  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // 调用可能存在的开始钩子
    await hooks?.onStartPick?.();

    // 如果没有任何图片，什么都不做
    const len = event.target.files?.length;
    if (!len) {
      return;
    }

    const rawList: Array<ImagePickList> = type === "grid" ? [...list] : [];
    // 读取所有图片到组件存储中
    for (let i = 0; i < len; i++) {
      try {
        let option: Partial<LoadImageOption> = {
          orientation: true,
          canvas: true,
        };
        if (typeof loadImageOption === "object") {
          option = { ...option, ...loadImageOption };
        }
        // 获取结果
        const result: any = await loadImage(event.target.files![i], option);

        // 转换为blob
        const blob = await new Promise<Blob>((resolve) => {
          (result.image as HTMLCanvasElement).toBlob((bin) => {
            resolve(bin!);
          });
        });

        // 向列表中添加一条数据
        rawList.push({
          canvas: result.image,
          blob,
          dataUrl: result.image.toDataURL(),
          originalHeight: result.originalHeight,
          originalWidth: result.originalWidth,
        });
      } catch (error) {}

      // 如果列表超过限制，退出循环
      if (rawList.length >= maxPick!) {
        break;
      }
    }

    // 更新列表
    setList([...rawList]);

    // 清理选中的图片，以便可以重复选取
    event.target.value = "";

    // 调用可能存在的结束钩子
    await hooks?.onEndPick?.();
  };

  return { list, onChange, onRemove };
}
