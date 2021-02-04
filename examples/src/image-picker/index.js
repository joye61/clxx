import "./index.scss";
import React from "react";
import { ImagePicker, Loading } from "@";

export default function () {
  return (
    <div>
      <ImagePicker
        gutter=".32rem"
        // renderPickButton={() => {
        //   return <span>Haha</span>;
        // }}
        multiple
        cols={4}
        // isSquare={false}
        onHookEachRound={()=>{
          // 显示一个loading
          let loading = null;
          const onStartPick = ()=>{
            loading = new Loading();
          }
          const onEndPick = async ()=>{
            await loading?.close();
          }
          return {onStartPick, onEndPick};
        }}
      />
    </div>
  );
}
