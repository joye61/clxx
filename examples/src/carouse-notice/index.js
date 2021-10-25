import React from 'react';
import { CarouselNotice } from '@';

export default function Index () {
  return (
    <div>
      <p>轮播条目只有一条（不滚动）：</p>
      <CarouselNotice
        list={['第一条滚动']}
        style={{ border: '1px solid blue' }}
        itemStyle={{
          color: "blue"
        }}
      />

      <p>轮播条目为纯文本：</p>
      <CarouselNotice
        list={['第一条滚动', '第二条滚动测试']}
        style={{ border: '1px solid red' }}
      />

      <p>轮播条目为任意React组件：</p>
      <CarouselNotice
        list={[
          <p>
            第一条<span style={{ color: 'pink' }}>粉色</span>滚动
          </p>,
          <p style={{ fontSize: '12px', color: 'red' }}>
            第二条红色文字要小一些
          </p>,
          <p style={{ fontWeight: 'bold' }}>第3条滚动文字加粗</p>,
          <p
            onClick={() => {
              alert('点击了第4条轮播条目');
            }}
            style={{ textDecoration: 'underline' }}
          >
            第4条可点击
          </p>,
        ]}
        style={{ background: '#f0f0f0' }}
      />

      <p>轮播条目左对齐：</p>
      <CarouselNotice
        justify="start"
        list={['第一条滚动', '第二条滚动测试']}
        style={{ border: '1px solid red' }}
      />

      <p>轮播条目右对齐：</p>
      <CarouselNotice
        justify="end"
        list={['第一条滚动', '第二条滚动测试']}
        style={{ border: '1px solid red' }}
      />
    </div>
  );
}
