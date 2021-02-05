/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useRef } from "react";
import { AutoGrid, AutoGridOption } from "../AutoGrid";
import { Clickable } from "../Clickable";
import { RowCenter } from "../Layout/Flex";
import { IconDelete } from "./icons";
import { style } from "./style";
import { ImagePickerOption } from "./types";
import { useButton } from "./useButton";
import { useOnChange } from "./useChange";

// 每一轮选取的开始和结束Hook
export interface EachPickStartEndResult {
  onStartPick?: () => void;
  onEndPick?: () => void;
}

export interface ImagePickerGridOption
  extends ImagePickerOption,
    AutoGridOption {
  // 每一轮各个阶段的钩子
  onHookEachRound?: () => EachPickStartEndResult;
}

export function ImagePicker(props: ImagePickerGridOption) {
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

  const file = useRef<HTMLInputElement | null>(null);

  // 文件选取改变时触发
  const { list, onChange, onRemove } = useOnChange({
    maxPick,
    onHookEachRound,
    onFilesChange,
    type: "grid",
  });

  // 获取按钮内容
  const btnContent = useButton({
    type: "grid",
    onClick() {
      file.current?.click();
    },
    renderPickButton,
    canPickMore: list.length < maxPick,
  });

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
            <Clickable onClick={() => onRemove(index)}>{IconDelete}</Clickable>
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
      {/* 最后一个元素是选取按钮 */}
      <div css={[style.btn, style.btnGridItem]}>
        {btnContent}
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          ref={file}
          onChange={onChange}
        />
      </div>
      {/* 显示预览图 */}
      {showPreviewList()}
    </AutoGrid>
  );
}
