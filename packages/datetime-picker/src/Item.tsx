/** @jsx jsx */
import { jsx } from "@emotion/core";
import { style } from "./style";

export interface DefaultItemProps {
  value: number | string;
  unit: string;
}

export function Item(props: DefaultItemProps) {
  return (
    <p css={style.item}>
      {props.value}
      <span css={style.unit}>{props.unit}</span>
    </p>
  );
}
