import "./index.scss";
import React, { useState } from "react";
import { Picker, showPicker } from "../../../packages/picker/build";

/**
 * 可能存在选取Bug，待真机验证 TODO
 */

export default function() {
  const [value, setValue] = useState<{
    v1: any;
    v2: any;
  }>({
    v1: "",
    v2: ""
  });

  return (
    <div>
      <div>
        <p>1、直接通过组件形式触发</p>
        <Picker
          className="Picker"
          list={[
            "选项一",
            "选项二",
            "选项三",
            "选项四",
            "选项五",
            "选项六",
            "选项七"
          ]}
          onConfirm={(index: number, result: any) => {
            console.log(`选择了第${index}项`, `选择的值为:${result}`);
            setValue({ ...value, v1: result });
          }}
        >
          {value.v1 || "点击显示选择器"}
        </Picker>
      </div>
      <div>
        <p>2、直接通过组件形式触发，但不显示当前选择（不显示标题）</p>
        <Picker
          className="Picker"
          showResult={false}
          list={[
            "选项一",
            "选项二",
            "选项三",
            "选项四",
            "选项五",
            "选项六",
            "选项七"
          ]}
          onConfirm={(index: number, result: any) => {
            console.log(`选择了第${index}项`, `选择的值为:${result}`);
            setValue({ ...value, v2: result });
          }}
        >
          {value.v2 || "点击显示选择器"}
        </Picker>
      </div>
      <div>
        <p>3、直接通过函数调用形式触发</p>
        <button
          onClick={() => {
            showPicker({
              list: [
                "选项一",
                "选项二",
                "选项三",
                "选项四",
                "选项五",
                "选项六",
                "选项七"
              ],
              onConfirm(index: number, result: any) {
                console.log(`选择了第${index}项`, `选择的值为:${result}`);
                alert(result);
              }
            });
          }}
        >
          点击显示选择器
        </button>
      </div>
    </div>
  );
}
