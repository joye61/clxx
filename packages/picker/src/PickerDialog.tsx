/** @jsx jsx */
import { jsx } from "@emotion/core";
import { style } from "./PickerDialogStyle";
import { useState } from "react";
import { ScrollContent } from "./ScrollContent";
import { ControlsProps, Controls } from "./Controls";
import { ColCenter } from "@clxx/layout";

export type PickerConfirm = (result: { index: number; value: any }) => void;

export interface PickerDialogProps extends ControlsProps {
  list?: Array<string | React.ReactElement>;
  selected?: number;
  onConfirm?: ((index: number, value?: any) => void) & any;
}

export function PickerDialog(props: PickerDialogProps) {
  const {
    list = [],
    selected = 0,
    onCancel,
    onConfirm,
    ...controlsProps
  } = props;

  const [current, setCurrent] = useState<number>(selected || 0);

  return (
    <div css={style.container}>
      <Controls
        {...controlsProps}
        onCancel={() => onCancel?.()}
        onConfirm={() => {
          onConfirm(current, list?.[current]);
        }}
      >
        <ColCenter css={style.resultBox}>
          <div css={style.hint}>当前选择</div>
          <div css={style.result}>{list?.[current]}</div>
        </ColCenter>
      </Controls>
      <ScrollContent
        list={list}
        selected={selected}
        onChange={(index: any) => {
          setCurrent(index);
        }}
      />
    </div>
  );
}
