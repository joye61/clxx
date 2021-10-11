/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Clickable } from "../Clickable";
import { IconCamera } from "./icons";
import { style } from "./style";
import { RenderPickButton } from "./types";

export interface UseButtonOption {
  renderPickButton?: RenderPickButton;
  onClick: () => void;
  canPickMore?: boolean;
  type: "single" | "grid";
}

export function useButton({
  renderPickButton,
  onClick,
  canPickMore,
  type,
}: UseButtonOption): React.ReactNode {
  // 判断是否有自定义的渲染按钮
  const hasCustomButton = typeof renderPickButton === "function";

  // 如果有自定义按钮，直接返回
  if (hasCustomButton) {
    return (
      <div onClick={canPickMore === false ? undefined : onClick}>
        {renderPickButton!(canPickMore)}
      </div>
    );
  }

  // 1、网格环境，2、默认按钮，3、按钮被禁用了（不能选择更多）
  if (type === "grid" && canPickMore === false) {
    return (
      <div
        css={[
          style.defaultBtnCenter,
          style.btnGridItem,
          style.defaultBtnDisable,
        ]}
      >
        {IconCamera}
      </div>
    );
  }

  // 其余所有场景返回可点击的默认按钮
  return (
    <Clickable
      css={[
        style.defaultBtnCenter,
        type === "grid" ? style.btnGridItem : style.btnSingle,
        style.defaultBtn,
      ]}
      onClick={onClick}
    >
      {IconCamera}
    </Clickable>
  );
}
