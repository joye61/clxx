import { showPicker, Picker } from "@";

export default function Index() {
  return (
    <>
      <p>1、函数式调用</p>
      <div>
        <button
          onClick={() => {
            showPicker({
              options: [
                { value: 1, label: "湖北" },
                { value: 2, label: "四川" },
                { value: 3, label: "江苏" },
                { value: 4, label: "重庆" },
                { value: 5, label: "湖南" },
                { value: 6, label: "辽宁" },
                { value: 7, label: "山东" },
                { value: 8, label: "河南" },
                { value: 9, label: "河北" },
                { value: 10, label: "广西" },
              ],
              onCancel() {
                console.log("取消了");
              },
              onConfirm(option, index) {
                console.log(`当前：`, option, index);
              },
            });
          }}
        >
          显示选择器
        </button>
      </div>

      <p>2、组件式调用，默认通过click事件触发</p>
      <Picker
        options={[
          { value: 1, label: "选项001" },
          { value: 2, label: "选项002" },
          { value: 3, label: "选项003" },
          { value: 4, label: "选项004" },
          { value: 5, label: "选项005" },
          { value: 6, label: "选项006" },
          { value: 7, label: "选项007" },
          { value: 8, label: "选项008" },
          { value: 9, label: "选项009" },
          { value: 10, label: "选项010" },
        ]}
        onCancel={() => {
          console.log("取消了");
        }}
        onConfirm={(option, index) => {
          console.log(`当前：`, option, index);
        }}
      >
        <p style={{ color: "red" }}>点击红色文字试试</p>
      </Picker>

      <p>3、定制按钮</p>
      <Picker
        options={[
          { value: 1, label: "选项001" },
          { value: 2, label: "选项002" },
          { value: 3, label: "选项003" },
          { value: 4, label: "选项004" },
          { value: 5, label: "选项005" },
          { value: 6, label: "选项006" },
          { value: 7, label: "选项007" },
          { value: 8, label: "选项008" },
          { value: 9, label: "选项009" },
          { value: 10, label: "选项010" },
        ]}
        onCancel={() => {
          console.log("取消了");
        }}
        onConfirm={(option, index) => {
          console.log(`当前：`, option, index);
        }}
        renderCancel={()=>{
          return <button>定制取消</button>
        }}
        renderConfirm={()=>{
          return <button>定制确认</button>
        }}
      >
        <p style={{ color: "red" }}>点击红色文字试试</p>
      </Picker>
    </>
  );
}
