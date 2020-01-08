/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Dialog } from "@clxx/dialog";
import { Cascade } from "./Cascade";
import { CascadeProps, CascadeResult, CascadePickerProps } from "./types";
import { useState } from "react";
import pick from "lodash/pick";
import omit from "lodash/omit";
import { style } from "./indexStyle";

/**
 * 级联选择器的函数形式调用
 * @param option
 */
export function showCascadePicker(option: CascadeProps = {}) {
  const { onCancel, onConfirm, ...props } = option;
  const dialog = new Dialog(
    (
      <Cascade
        onCancel={() => {
          dialog.close();
          onCancel?.();
        }}
        onConfirm={(result: CascadeResult) => {
          dialog.close();
          onConfirm?.(result);
        }}
        {...props}
      />
    ),
    "pullup"
  );
}

/**
 * 级联选择器组件
 * @param props
 */
export function CascadePicker(
  props: Partial<CascadePickerProps> &
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >
) {
  const { children, renderResult, ...left } = props;
  const [result, setResult] = useState<CascadeResult | undefined>(undefined);
  const cascadeOption = [
    "title",
    "data",
    "defaultValue",
    "showResult",
    "onCancel",
    "onConfirm",
    "confirmText",
    "cancelText"
  ];

  const cascadeProps = pick(left, cascadeOption);
  const attributes = omit(left, cascadeOption);
  cascadeProps.onConfirm = (result: CascadeResult) => {
    setResult(result);
  };

  /**
   * 显示结果内容
   */
  const showChildren = () => {
    if (!result) {
      if (typeof children === "string") {
        return <div css={style.placeholder}>{children}</div>;
      } else {
        return children;
      }
    } else {
      if (typeof renderResult === "function") {
        return renderResult(result);
      } else {
        let showValue = "";
        for (let item of result.value) {
          showValue += item.name;
        }
        return <div>{showValue}</div>;
      }
    }
  };

  return (
    <div
      onClick={() => {
        showCascadePicker(cascadeProps);
      }}
      {...attributes}
    >
      {showChildren()}
    </div>
  );
}


