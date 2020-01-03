/** @jsx jsx */
import { jsx } from "@emotion/core";
import { RowCenter, Row, RowStart } from "@clxx/layout";
import { style } from "./CascadeStyle";
import { ScrollContent } from "@clxx/picker/build/ScrollContent";

export function Cascade() {
  return (
    <div css={style.container} className="clxx-Cascade">
      <RowCenter css={style.head}>
        <p css={style.defaultTitle}>请选择所在地区</p>
        <span css={style.close} onTouchStart={() => {}}>
          <svg viewBox="0 0 1024 1024">
            <path d="M512 0C229.272524 0 0 229.272524 0 512s229.272524 512 512 512 512-229.272524 512-512S794.727476 0 512 0z m241.359982 701.667784a36.571429 36.571429 0 1 1-51.71509 51.715091L512 563.715091 322.355108 753.359982a36.571429 36.571429 0 1 1-51.71509-51.71509L460.284909 512 270.640018 322.355108a36.571429 36.571429 0 0 1 51.71509-51.71509L512 460.284909l189.644892-189.644891a36.571429 36.571429 0 0 1 51.71509 51.71509L563.715091 512z" />
          </svg>
        </span>
      </RowCenter>
      <RowCenter css={style.select}>
        <div css={[style.selectItem]}>上海市</div>
        <span css={style.selectItemSeperator}>／</span>
        <div css={[style.selectItem]}>浦东新区</div>
        <span css={style.selectItemSeperator}>／</span>
        <div css={[style.selectItem, style.selectItemActive]}>
          花木街道办事处
        </div>
      </RowCenter>

      <ScrollContent
        list={[
          <div css={style.optionItem}>北蔡</div>,
          <div css={style.optionItem}>塘桥</div>,
          <div css={style.optionItem}>花木</div>,
          <div css={style.optionItem}>芳华</div>,
          <div css={style.optionItem}>金桥</div>,
          <div css={style.optionItem}>陆家嘴</div>,
          <div css={style.optionItem}>周浦</div>,
          <div css={style.optionItem}>鹤沙航城</div>,
          <div css={style.optionItem}>川沙</div>
        ]}
      />
    </div>
  );
}
