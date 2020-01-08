import "./index.scss";
import React, { useState } from "react";
import { ScrollView } from "../../../packages/scrollview/build";

export default function() {
  const [num, setNum] = useState<number>(10);

  const showList = (fixNum?: number) => {
    const showNum = fixNum ?? num;
    const list: React.ReactNode[] = [];
    for (let i = 0; i < showNum; i++) {
      list.push(<p key={i}>测试列表元素{i}</p>);
    }
    return list;
  };

  return (
    <div>
      <div>
        <p>1、常规滚动容器</p>
        <ScrollView className="ScrollViewList" height="2rem">
          {showList(15)}
        </ScrollView>
      </div>
      <div>
        <p>2、触底加载更多，每次触底加载10条数据</p>
        <ScrollView
          className="ScrollViewList"
          height="2rem"
          onReachEnd={() => {
            console.log("到达底部", num);
            setNum(num + 10);
          }}
        >
          {showList()}
        </ScrollView>
      </div>
      <div>
        <p>3、滚动容器带自动隐藏的滚动条，滚动条自动隐藏</p>
        <ScrollView className="ScrollViewList" height="2rem" scrollBar>
          {showList(15)}
        </ScrollView>
      </div>
      <div>
        <p>4、滚动容器带自动隐藏的滚动条，滚动条始终存在</p>
        <ScrollView
          className="ScrollViewList"
          height="2rem"
          scrollBar={{ fade: false }}
        >
          {showList(15)}
          
        </ScrollView>
      </div>
    </div>
  );
}
