import React from "react";
import { ImagePicker } from "../../../packages/image-picker/build";

export default function() {
  return (
    <div>
      <div>
        <p>1、显示3列，最多选取4张</p>
        <ImagePicker maxPick={4} column={3}/>
      </div>
      <div>
        <p>2、显示4列，最多选取9张，允许多选</p>
        <ImagePicker column={4} multiple/>
      </div>
      <div>
        <p>3、显示4列，最多选取9张，允许多选，不显示图片缩略图</p>
        <ImagePicker column={4} multiple showPickedThumb={false}/>
      </div>
    </div>
  );
}
