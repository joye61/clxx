/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useRef } from "react";
import { style } from "./style";
import { ImagePickerOption } from "./types";
import { useButton } from "./useButton";
import { useOnChange } from "./useChange";

export function SimpleImagePicker(props: ImagePickerOption) {
  const {
    maxPick = 10,
    multiple = false,
    renderPickButton,
    onFilesChange,
    onHookEachRound,
  } = props;

  // 当前文件上传域的引用
  const file = useRef<HTMLInputElement | null>(null);

  const { onChange } = useOnChange({
    maxPick,
    onHookEachRound,
    onFilesChange,
    type: "single",
  });

  const content = useButton({
    type: "single",
    onClick() {
      file.current?.click();
    },
    renderPickButton,
  });

  return (
    <div css={style.btn}>
      {content}
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        ref={file}
        onChange={onChange}
      />
    </div>
  );
}
