import './index.scss';
import React from 'react';
import { Touchable } from '@';

export default function () {
  return (
    <div className="Touchable">
      <Touchable className="btntest">
        可点击元素
        <Touchable>内嵌可点击元素</Touchable>
        <Touchable bubble={false}>内嵌可点击元素 bubble=false</Touchable>
        <Touchable activeStyle={{ backgroundColor: 'green', color: 'cyan' }}>
          内嵌 activeStyle
        </Touchable>
        <Touchable
          bubble={false}
          activeStyle={{ backgroundColor: 'green', color: 'cyan' }}
        >
          内嵌 activeStyle bubble=false
        </Touchable>
      </Touchable>

      <Touchable
        className="as"
        activeStyle={{ backgroundColor: 'green', color: 'cyan' }}
      >
        activeStyle
      </Touchable>

      <Touchable
        disable
        className="as"
        activeStyle={{ backgroundColor: 'green', color: 'cyan' }}
      >
        activeStyle(禁用) disable=true
      </Touchable>
    </div>
  );
}
