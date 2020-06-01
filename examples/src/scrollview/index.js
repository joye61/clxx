import React, { useState } from 'react';
import { ScrollView } from '@';
import style from './index.module.scss';

export default function () {
  const [len, setLen] = useState(20);
  const showContent = () => {
    const output = [];
    for (let i = 1; i <= len; i++) {
      output.push(<p key={i}>这是第{i}条测试文本</p>);
    }
    return output;
  };
  return (
    <ScrollView
      height="4rem"
      showLoading={true}
      className={style.container}
      onReachBottom={() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
            setLen((pre) => pre + 20);
          }, 2000);
        });
      }}
      onScroll={(event) => {
        console.log(event);
      }}
    >
      {showContent()}
    </ScrollView>
  );
}
