import { showCascader, Cascader } from "@";
import { province } from "./province";
import { city } from "./city";
import { district } from "./district";

export default function Index() {
  const data = province.slice(0);
  data.forEach((item) => {
    city[item.value].forEach((cityItem) => {
      cityItem.children = district[cityItem.value];
    });
    item.children = city[item.value];
  });

  return (
    <>
      <p>1、函数式调用</p>
      <div>
        <button
          onClick={() => {
            showCascader({
              defaultValue: ["anhui", "huangshan", "shexian", "shendu"],
              onSelect: (value) => {
                console.log("selectChange", value);
              },
              options: data,
              renderTitle() {
                return "标题";
              },
              onCancel() {
                console.log("取消了");
              },
              onConfirm(values) {
                console.log(values);
              },
            });
          }}
        >
          显示选择器
        </button>
      </div>

      <p>2、组件式调用，默认通过click事件触发</p>
      <Cascader
        defaultValue={["anhui", "huangshan", "shexian", "shendu"]}
        onClick={() => {
          console.log("点击");
        }}
        onSelect={(value) => {
          console.log("selectChange", value);
        }}
        options={[
          {
            label: "上海市",
            value: "shanghai",
            children: [
              {
                label: "闵行",
                value: "minhang",
                children: [{ label: "七宝", value: "qibao" }],
              },
              {
                label: "长宁区",
                value: "changning",
              },
              {
                label: "浦东新区",
                value: "pudong",
                children: [{ label: "陆家嘴街道", value: "lujiazui" }],
              },
            ],
          },
          {
            label: "安徽",
            value: "anhui",
            children: [
              {
                label: "合肥",
                value: "hefei",
                children: [
                  {
                    label: "蜀山区",
                    value: "shushan",
                    children: [{ label: "西园街道", value: "xiyuan" }],
                  },
                  { label: "瑶海区", value: "yaohai" },
                  { label: "包河区", value: "baohe" },
                  { label: "巢湖市", value: "chaohu" },
                ],
              },
              {
                label: "黄山",
                value: "huangshan",
                children: [
                  {
                    label: "屯溪区",
                    value: "tunxi",
                    children: [
                      { label: "黎阳", value: "liyang" },
                      { label: "老街街道", value: "laojie" },
                    ],
                  },
                  {
                    label: "歙县",
                    value: "shexian",
                    children: [
                      { label: "郑村", value: "zhengcun" },
                      { label: "深渡", value: "shendu" },
                    ],
                  },
                  {
                    label: "绩溪",
                    value: "jixi",
                  },
                  {
                    label: "休宁县",
                    value: "xiuning",
                  },
                ],
              },
            ],
          },
        ]}
        renderTitle={() => {
          return "标题";
        }}
        onCancel={() => {
          console.log("取消了");
        }}
        onConfirm={(values) => {
          console.log(values);
        }}
      >
        <p style={{ color: "red" }}>点击红色文字试试</p>
      </Cascader>
    </>
  );
}
