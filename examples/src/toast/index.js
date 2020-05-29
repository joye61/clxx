import React from 'react';
import { showToast } from '@';

export default function () {
  return (
    <div>
      <p>toast内容为纯文本</p>
      <button
        onClick={() => {
          showToast('一个简单的Toast轻提示');
        }}
      >
        显示Toast
      </button>

      <p>toast内容为可定制组件</p>
      <button
        onClick={() => {
          showToast(
            <div style={{ border: '1px solid red' }}>
              一个简单的<span style={{ color: 'red' }}>Toast</span>轻提示
            </div>,
          );
        }}
      >
        显示Toast
      </button>

      <p>toast内容在顶部显示</p>
      <button
        onClick={() => {
          showToast({
            content: '一个简单的Toast轻提示',
            position: 'top'
          });
        }}
      >
        显示Toast
      </button>

      <p>toast内容在底部显示</p>
      <button
        onClick={() => {
          showToast({
            content: '一个简单的Toast轻提示',
            position: 'bottom'
          });
        }}
      >
        显示Toast
      </button>
    </div>
  );
}
