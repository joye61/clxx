/** @jsx jsx */
import { jsx } from "@emotion/core";
import { RowCenter, Row } from "@clxx/layout";
import { style } from "./CascadeStyle";
import { CascadeProps, CascadeDataItem } from "./types";
import { useEffect, useState, useRef } from "react";
import { ensureDataSource } from "./util";
import { ScrollContent } from "@clxx/picker/build/ScrollContent";

export function Cascade(props: CascadeProps) {
  const [value, setValue] = useState<number[]>(props.defaultValue || []);
  const dataSource = useRef<Array<CascadeDataItem>>([]);

  useEffect(() => {
    (async () => {
      dataSource.current = await ensureDataSource(props.data);
    })();
  });

  const showList = ()=>{
    
    value.forEach((item, index)=>{

    })
  }

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

      <Row css={style.content}>
        <ScrollContent
          list={[
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>
          ]}
        />
        <ScrollContent
          list={[
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>
          ]}
        />
        <ScrollContent
          list={[
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>,
            <p css={style.optionItem}>北蔡</p>
          ]}
        />
      </Row>
    </div>
  );
}
