/** @jsx jsx */
import { jsx } from "@emotion/core";
import { RowCenter, Row } from "@clxx/layout";
import { style } from "./style";

export function CascadePicker() {
  return (
    <Row align="center" justify="flex-start">
      <RowCenter
        css={[style.item, style.itemPlaceholder]}
        onTouchStart={() => {}}
      >
        <span>请选择省份</span>
        {/* <span>广西壮族自治区</span> */}
      </RowCenter>
      <span css={style.seperator}>／</span>
      <RowCenter
        css={[style.item, style.itemPlaceholder]}
        onTouchStart={() => {}}
      >
        <span>请选择城市</span>
        {/* <span>黄石市黄石市黄石市黄石市</span> */}
      </RowCenter>
      <span css={style.seperator}>／</span>
      <RowCenter
        css={[style.item, style.itemPlaceholder]}
        onTouchStart={() => {}}
      >
        <span>请选择地区</span>
        {/* <span>大冶市</span> */}
      </RowCenter>
    </Row>
  );
}
