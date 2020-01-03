/** @jsx jsx */
import { jsx } from "@emotion/core";
import { RowCenter, Row } from "@clxx/layout";
import { Dialog } from "@clxx/dialog";
import { Cascade } from "./Cascade";

export function showCascadePicker(){
  const dialog = new Dialog(<Cascade />, "pullup");
}
